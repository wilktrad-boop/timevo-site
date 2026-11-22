import test from "node:test";
import assert from "node:assert/strict";
import { magasinMemoire, autoriser, rendre, LIMITES } from "../../lib/avis/limites.ts";

test("autoriser compte jusqu'au maximum puis refuse sans dépasser", async () => {
  const m = magasinMemoire();
  for (let i = 0; i < 3; i++) assert.equal(await autoriser(m, "email:a", 3), true);
  assert.equal(await autoriser(m, "email:a", 3), false);
  assert.equal(await autoriser(m, "email:b", 3), true);
  await rendre(m, "email:a");
  assert.equal(await autoriser(m, "email:a", 3), true);
  assert.deepEqual(LIMITES, { recherchesParIp: 20, recherchesParJour: 1000, auditsParEmail: 3, auditsParJour: 50, codesParIp: 5, codesParEmail: 3, essaisParCode: 5 });
});

test("les compteurs et les valeurs expirent", async () => {
  let t = 0;
  const m = magasinMemoire(() => t);
  await m.incr("k", 10);
  await m.ecrire("v", { a: 1 }, 10);
  assert.deepEqual(await m.lire("v"), { a: 1 });
  t = 11_000;
  assert.equal(await m.lire("v"), null);
  assert.equal(await m.incr("k", 10), 1);
});

test("prendre ne réussit qu'une fois tant que la clé vit", async () => {
  const m = magasinMemoire();
  assert.equal(await m.prendre("verrou", 60), true);
  assert.equal(await m.prendre("verrou", 60), false);
});
