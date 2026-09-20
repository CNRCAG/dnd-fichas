import test from "node:test";
import assert from "node:assert/strict";
import { ANTECEDENTES, obterAntecedente } from "../src/data/antecedentes.js";
import { FERRAMENTAS } from "../src/data/equipamentos.js";

const ANTECEDENTES_BASICOS = [
  "acolito",
  "charlatao",
  "criminoso",
  "artista",
  "heroi-do-povo",
  "artesao-guildado",
  "eremita",
  "nobre",
  "forasteiro",
  "sabio",
  "marinheiro",
  "soldado",
  "orfao",
];

test("catálogo contém os treze antecedentes básicos sem IDs repetidos", () => {
  assert.deepEqual(
    ANTECEDENTES_BASICOS.filter((id) => !obterAntecedente(id)),
    []
  );
  assert.equal(new Set(ANTECEDENTES.map((item) => item.id)).size, ANTECEDENTES.length);
});

test("novos antecedentes mantêm duas perícias e ferramentas cadastradas", () => {
  const ferramentasIds = new Set(FERRAMENTAS.map((item) => item.id));

  for (const id of ["charlatao", "artista", "forasteiro", "marinheiro", "orfao"]) {
    const antecedente = obterAntecedente(id);
    assert.equal(antecedente.periciasConcedidas.length, 2, id);
    assert.ok(antecedente.caracteristica?.nome, id);
    for (const ferramentaId of antecedente.ferramentasFixas ?? []) {
      assert.equal(ferramentasIds.has(ferramentaId), true, `${id}: ${ferramentaId}`);
    }
    for (const ferramentaId of antecedente.ferramentasEscolha?.opcoes ?? []) {
      assert.equal(ferramentasIds.has(ferramentaId), true, `${id}: ${ferramentaId}`);
    }
  }
});

test("Marinheiro concede navegação e veículos aquáticos", () => {
  assert.deepEqual(
    obterAntecedente("marinheiro").ferramentasFixas,
    ["ferramentas-navegador", "veiculos-aquaticos"]
  );
});
