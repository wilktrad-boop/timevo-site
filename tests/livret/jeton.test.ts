import test from "node:test";
import assert from "node:assert/strict";
import {
  creerCode, jetonCode, verifierCode, jetonAcces, verifierAcces, CODE_DUREE_MS, ACCES_DUREE_MS,
} from "../../lib/livret/jeton.ts";

const SECRET = "secret-de-test-assez-long-pour-hmac";
const INFOS = { email: "camille@exemple.fr", conciergerie: "Rive Gauche", logements: "6 à 15" };
const T0 = 1_800_000_000_000;

test("creerCode donne six chiffres", () => {
  for (let i = 0; i < 50; i++) assert.match(creerCode(), /^\d{6}$/);
});

test("le jeton de code ne contient pas le code en clair", () => {
  const j = jetonCode(INFOS, "123456", SECRET, T0);
  assert.equal(Buffer.from(j.split(".")[0], "base64url").toString().includes("123456"), false);
});

test("verifierCode accepte le bon code et rend les infos du formulaire", () => {
  const j = jetonCode(INFOS, "123456", SECRET, T0);
  assert.deepEqual(verifierCode(j, " 123456 ", SECRET, T0 + 1000), INFOS);
});

test("verifierCode refuse un mauvais code, un code expiré, un autre secret, un jeton modifié", () => {
  const j = jetonCode(INFOS, "123456", SECRET, T0);
  assert.equal(verifierCode(j, "654321", SECRET, T0), null);
  assert.equal(verifierCode(j, "123456", SECRET, T0 + CODE_DUREE_MS + 1), null);
  assert.equal(verifierCode(j, "123456", "autre-secret", T0), null);
  const [corps, sig] = j.split(".");
  const falsifie = Buffer.from(JSON.stringify({ ...JSON.parse(Buffer.from(corps, "base64url").toString()), email: "x@y.fr" })).toString("base64url");
  assert.equal(verifierCode(`${falsifie}.${sig}`, "123456", SECRET, T0), null);
  assert.equal(verifierCode("n'importe quoi", "123456", SECRET, T0), null);
});

test("un jeton de code ne vaut pas jeton d'accès, et inversement", () => {
  assert.equal(verifierAcces(jetonCode(INFOS, "123456", SECRET, T0), SECRET, T0), null);
  assert.equal(verifierCode(jetonAcces(INFOS.email, SECRET, T0), "123456", SECRET, T0), null);
});

test("verifierAcces rend l'email jusqu'à l'expiration", () => {
  const j = jetonAcces(INFOS.email, SECRET, T0);
  assert.equal(verifierAcces(j, SECRET, T0 + ACCES_DUREE_MS - 1), INFOS.email);
  assert.equal(verifierAcces(j, SECRET, T0 + ACCES_DUREE_MS + 1), null);
  assert.equal(verifierAcces(j, "autre-secret", T0), null);
});
