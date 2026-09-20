import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

let servidor;
let catalogo;
let itens;
let ataque;
let equipamento;
let fichaUtils;

before(async () => {
  servidor = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  catalogo = await servidor.ssrLoadModule("/src/data/itensMagicos.js");
  itens = await servidor.ssrLoadModule("/src/utils/itensMagicos.js");
  ataque = await servidor.ssrLoadModule("/src/utils/ataque.js");
  equipamento = await servidor.ssrLoadModule("/src/utils/equipamento.js");
  fichaUtils = await servidor.ssrLoadModule("/src/utils/ficha.js");
});

after(async () => { await servidor?.close(); });

test("catálogo mágico inicial possui itens nomeados e regras orientadas por dados", () => {
  for (const id of [
    "espada-longa-mais-1",
    "escudo-mais-1",
    "manto-protecao",
    "varinha-misseis-magicos",
    "botas-elficas",
    "pocao-cura",
  ]) {
    const item = catalogo.obterItemMagico(id);
    assert.ok(item, id);
    assert.ok(item.regras.length > 0, id);
  }
});

test("sintonização respeita o limite de três itens", () => {
  let inventario = [0, 1, 2, 3].map((indice) => ({
    id: `item-${indice}`,
    magico: true,
    requerSintonizacao: true,
    sintonizado: false,
  }));

  for (const id of ["item-0", "item-1", "item-2"]) {
    const resultado = itens.alterarSintonizacao(inventario, id, true);
    assert.equal(resultado.erro, null);
    inventario = resultado.inventario;
  }

  const excedente = itens.alterarSintonizacao(inventario, "item-3", true);
  assert.match(excedente.erro, /limite de 3/i);
  assert.equal(itens.contarItensSintonizados(excedente.inventario), 3);
});

test("normalização de importação remove sintonização acima do limite", () => {
  const inventario = [0, 1, 2, 3].map((indice) => ({
    id: `item-${indice}`,
    magico: true,
    requerSintonizacao: true,
    sintonizado: true,
  }));
  assert.equal(itens.contarItensSintonizados(itens.normalizarInventario(inventario)), 3);
});

test("cargas não podem ficar negativas e a recuperação respeita o máximo", () => {
  const inventario = [{ id: "varinha", cargasAtuais: 1, cargasMaximas: 7 }];
  const gasto = itens.gastarCargasItem(inventario, "varinha", 1);
  assert.equal(gasto.erro, null);
  assert.equal(gasto.inventario[0].cargasAtuais, 0);
  assert.match(itens.gastarCargasItem(gasto.inventario, "varinha", 1).erro, /suficientes/i);

  const recarga = itens.recuperarCargasItem(gasto.inventario, "varinha", 20);
  assert.equal(recarga.inventario[0].cargasAtuais, 7);
  assert.equal(recarga.recuperadas, 7);
});

test("Manto de Proteção só aplica efeitos equipado e sintonizado", () => {
  const manto = {
    magico: true,
    requerEquipado: true,
    equipado: true,
    requerSintonizacao: true,
    sintonizado: false,
    efeitos: [{ tipo: "bonus-ca", valor: 1 }, { tipo: "bonus-salvaguardas", valor: 1 }],
  };
  assert.equal(itens.somarEfeitoItens([manto], "bonus-ca"), 0);
  assert.equal(itens.somarEfeitoItens([{ ...manto, sintonizado: true }], "bonus-ca"), 1);
  assert.equal(itens.somarEfeitoItens([{ ...manto, sintonizado: true }], "bonus-salvaguardas"), 1);
});

test("itens mágicos genéricos legados preservam bônus de arma e armadura", () => {
  const espada = {
    id: "espada-legada",
    nome: "Espada antiga",
    origemId: "arma-espada-longa",
    tipoItem: "arma",
    equipado: true,
    atributoAtaque: "auto",
    magico: true,
    bonusMagico: 2,
  };
  assert.equal(ataque.criarAtaqueApartirDeItemEquipado(espada).bonusMagico, 2);

  const couro = {
    id: "couro-legado",
    origemId: "armadura-couro",
    tipoItem: "armadura",
    equipado: true,
    magico: true,
    bonusMagico: 1,
  };
  assert.equal(
    equipamento.calcularCaEquipada([couro], { destreza: 2, constituicao: 0, sabedoria: 0 }, "guerreiro"),
    14
  );
});

test("estado de sintonização e cargas sobrevive à normalização da ficha", () => {
  const normalizada = fichaUtils.normalizarFicha({
    id: "ficha",
    nivel: 1,
    classeId: "mago",
    atributos: {},
    status: { pvMax: 6, pvAtual: 6 },
    inventario: [{
      id: "varinha",
      magico: true,
      requerSintonizacao: true,
      sintonizado: true,
      cargasMaximas: 7,
      cargasAtuais: 4,
    }],
  });
  assert.equal(normalizada.inventario[0].sintonizado, true);
  assert.equal(normalizada.inventario[0].cargasAtuais, 4);
  assert.equal(normalizada.versaoFicha, 8);
});
