import test from "node:test";
import assert from "node:assert/strict";
import { configAvis } from "../../lib/avis/config.ts";

// Next déclare NODE_ENV en lecture seule : on passe par un enregistrement simple.
const env = process.env as Record<string, string | undefined>;

const VARIABLES = [
  "LIVRET_SECRET", "SMTP_USER", "SMTP_PASSWORD", "AVIS_SIMULATION", "NODE_ENV",
  "DATAFORSEO_LOGIN", "DATAFORSEO_PASSWORD", "ANTHROPIC_API_KEY",
  "UPSTASH_REDIS_REST_URL", "UPSTASH_REDIS_REST_TOKEN", "KV_REST_API_URL", "KV_REST_API_TOKEN",
];

/** Lance f avec exactement ces variables (les autres de la liste effacées), puis remet process.env en l'état. */
async function avecEnv(valeurs: Record<string, string>, f: () => Promise<void> | void) {
  const avant = Object.fromEntries(VARIABLES.map(k => [k, env[k]]));
  try {
    for (const k of VARIABLES) delete env[k];
    Object.assign(env, valeurs);
    await f();
  } finally {
    for (const k of VARIABLES) {
      if (avant[k] === undefined) delete env[k];
      else env[k] = avant[k];
    }
  }
}

const BASE = { LIVRET_SECRET: "x".repeat(48), SMTP_USER: "site@test.invalid", SMTP_PASSWORD: "essai", AVIS_SIMULATION: "1" };

test("la simulation ne s'ouvre jamais en production", async () => {
  await avecEnv({ ...BASE, NODE_ENV: "production" }, () => {
    assert.equal(configAvis(), null);
  });
});

test("la simulation s'ouvre en développement", async () => {
  await avecEnv({ ...BASE, NODE_ENV: "development" }, async () => {
    const c = configAvis();
    assert.ok(c);
    assert.equal((await c.donnees.rechercher("Cuisiniste Annecy")).length, 5);
  });
});

test("sans LIVRET_SECRET, l'outil reste fermé", async () => {
  const { LIVRET_SECRET: _, ...sansSecret } = BASE;
  await avecEnv({ ...sansSecret, NODE_ENV: "development" }, () => {
    assert.equal(configAvis(), null);
  });
});
