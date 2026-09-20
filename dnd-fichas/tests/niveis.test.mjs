import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

let servidor;
let niveis;
let fichaUtils;
let progressao;

function fichaBase(overrides = {}) {
  return {
    nome: "Teste",
    classeId: "guerreiro",
    nivel: 1,
    classesSecundarias: [],
    atributos: {
      forca: 13,
      destreza: 13,
      constituicao: 14,
      inteligencia: 13,
      sabedoria: 13,
      carisma: 13,
    },
    status: { pvMax: 12, pvAtual: 12, pvTemp: 0 },
    pvPorNivel: { 1: 12 },
    origemClassePvPorNivel: { 1: "guerreiro" },
    ...overrides,
  };
}

before(async () => {
  servidor = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  niveis = await servidor.ssrLoadModule("/src/utils/niveis.js");
  fichaUtils = await servidor.ssrLoadModule("/src/utils/ficha.js");
  progressao = await servidor.ssrLoadModule("/src/utils/progressao.js");
});

after(async () => { await servidor?.close(); });

test("nível 19 pode avançar para 20", () => {
  const normalizada = fichaUtils.normalizarFicha(fichaBase({ nivel: 20 }));
  assert.equal(normalizada.nivel, 20);
  assert.equal(niveis.calcularNivelTotal(normalizada), 20);
  assert.equal(normalizada.normalizacaoNiveis, undefined);
});

test("mutação direta de nível 20 para 21 é contida pelo normalizador", () => {
  const normalizada = fichaUtils.normalizarFicha(fichaBase({ nivel: 21 }));
  assert.equal(normalizada.nivel, 20);
  assert.equal(niveis.calcularNivelTotal(normalizada), 20);
  assert.equal(normalizada.normalizacaoNiveis.ajustado, true);
  assert.equal(normalizada.normalizacaoNiveis.original.nivel, 21);
});

test("multiclasse 15 + 5 permanece válida", () => {
  const normalizada = fichaUtils.normalizarFicha(fichaBase({
    nivel: 15,
    classesSecundarias: [{ classeId: "mago", nivel: 5, subclasseId: null }],
  }));
  assert.equal(niveis.calcularNivelTotal(normalizada), 20);
  assert.equal(normalizada.classesSecundarias[0].nivel, 5);
  assert.equal(normalizada.normalizacaoNiveis, undefined);
});

test("multiclasse 15 + 6 é ajustada para o saldo disponível", () => {
  const normalizada = fichaUtils.normalizarFicha(fichaBase({
    nivel: 15,
    classesSecundarias: [{ classeId: "mago", nivel: 6, subclasseId: null }],
  }));
  assert.equal(niveis.calcularNivelTotal(normalizada), 20);
  assert.equal(normalizada.classesSecundarias[0].nivel, 5);
  assert.equal(normalizada.normalizacaoNiveis.ajustado, true);
});

test("importação legada acima do teto é estável e idempotente", () => {
  const importada = fichaBase({
    nivel: "12",
    classesSecundarias: [
      { classeId: "mago", nivel: 7 },
      { classeId: "ladino", nivel: 6 },
    ],
  });
  const primeira = fichaUtils.normalizarFicha(importada);
  const segunda = fichaUtils.normalizarFicha(primeira);
  assert.equal(niveis.calcularNivelTotal(primeira), 20);
  assert.deepEqual(segunda.classesSecundarias, primeira.classesSecundarias);
  assert.deepEqual(segunda.normalizacaoNiveis, primeira.normalizacaoNiveis);
});

test("nenhum nível individual permanece acima de 20", () => {
  const normalizada = fichaUtils.normalizarFicha(fichaBase({ nivel: 99 }));
  assert.equal(normalizada.nivel, 20);
  assert.equal(niveis.calcularNivelTotal(normalizada), 20);
});

test("descer e retornar ao nível reaproveita o PV banked", () => {
  const guerreiro = { id: "guerreiro", dadoVida: 10 };
  const ficha = fichaBase({
    nivel: 5,
    pvPorNivel: { 1: 12, 2: 8, 3: 8, 4: 8, 5: 9 },
    origemClassePvPorNivel: {
      1: "guerreiro", 2: "guerreiro", 3: "guerreiro",
      4: "guerreiro", 5: "guerreiro",
    },
    status: { pvMax: 45, pvAtual: 40, pvTemp: 0 },
  });
  const reduzida = progressao.recalcularPv(ficha, guerreiro, 2, 4);
  const restaurada = progressao.recalcularPv(
    { ...ficha, ...reduzida },
    guerreiro,
    2,
    5
  );
  assert.equal(restaurada.pvPorNivel[5], 9);
  assert.equal(restaurada.status.pvMax, 45);
});
