import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

let servidor;
let recursos;
let catalogo;
let recursosSubclasses;

const fichaBase = (overrides = {}) => ({
  classeId: "guerreiro",
  nivel: 5,
  subclasseId: "mestre-de-batalha",
  classesSecundarias: [],
  habilidades: [],
  inventario: [],
  recursos: [],
  ...overrides,
});

const contexto = {
  nivelTotal: 5,
  bonusProficiencia: 3,
  modificadores: {
    forca: 3,
    destreza: 2,
    constituicao: 2,
    inteligencia: 4,
    sabedoria: 1,
    carisma: 0,
  },
};

before(async () => {
  servidor = await createServer({
    server: { middlewareMode: true, hmr: false },
    appType: "custom",
  });
  recursos = await servidor.ssrLoadModule("/src/utils/recurso.js");
  catalogo = await servidor.ssrLoadModule("/src/data/recursosRastreaveis.js");
  recursosSubclasses = await servidor.ssrLoadModule("/src/data/recursosSubclasses.js");
});

after(async () => { await servidor?.close(); });

test("recursos existentes de subclasse mantêm máximo e restauração", () => {
  const definicao = recursosSubclasses.RECURSOS_SUBCLASSES.find(
    (item) => item.id === "dados-superioridade"
  );
  assert.equal(recursos.resolverUsosMax(definicao, { nivel: 7 }), 5);
  assert.equal(
    recursos.restaurarRecursos(
      [{ nome: definicao.nome, usosMax: 5, usosGastos: 5, restauraEm: definicao.restauraEm }],
      "curto"
    )[0].usosGastos,
    0
  );
});

test("fórmula genérica combina nível, atributo e proficiência", () => {
  const definicao = {
    formulaMaximo: {
      base: 2,
      porNivel: 1,
      divisorNivel: 2,
      atributo: { chave: "inteligencia", multiplicador: 2 },
      bonusProficiencia: 1,
      arredondamento: "baixo",
      minimo: 1,
    },
  };
  assert.equal(recursos.resolverUsosMax(definicao, { ...contexto, nivel: 5 }), 15);
});

test("talento acrescenta recurso somente por dados do catálogo", () => {
  const ficha = fichaBase({
    habilidades: [{ id: "talento", tipo: "talento", origemId: "sortudo", nome: "Sortudo" }],
  });
  const sugestoes = recursos.listarSugestoesRecursos(
    catalogo.RECURSOS_RASTREAVEIS,
    ficha,
    contexto
  );
  const pontosSorte = sugestoes.find((item) => item.id === "pontos-sorte");
  assert.equal(pontosSorte?.usosMaxSugerido, 3);

  const criado = recursos.criarRecursoDoCatalogo(pontosSorte, ficha, contexto, () => "sorte");
  assert.equal(criado.origemTipo, "talento");
  assert.equal(criado.origemTalentoId, "sortudo");
  assert.equal(criado.usosMax, 3);
});

test("origens de item são reconhecidas sem código específico do item", () => {
  const definicao = {
    id: "uso-item-teste",
    nome: "Uso do item",
    origem: { tipo: "item", itemId: "item-teste", requerSintonizado: true },
    formulaMaximo: { base: 2 },
    restauraEm: "longo",
  };
  const ficha = fichaBase({
    inventario: [{ id: "instancia", itemMagicoId: "item-teste", sintonizado: true }],
  });
  assert.equal(recursos.recursoDisponivel(definicao, ficha), true);
  assert.equal(
    recursos.listarSugestoesRecursos([definicao], ficha, contexto)[0].usosMaxSugerido,
    2
  );
});

test("sincronização recalcula, limita gastos e remove recurso sem a fonte", () => {
  const definicao = catalogo.RECURSOS_RASTREAVEIS.find((item) => item.id === "pontos-sorte");
  const comTalento = fichaBase({
    habilidades: [{ tipo: "talento", origemId: "sortudo" }],
    recursos: [{ id: "sorte", origemId: "pontos-sorte", usosMax: 9, usosGastos: 8 }],
  });
  const sincronizados = recursos.sincronizarRecursosCatalogo(
    comTalento.recursos,
    [definicao],
    comTalento,
    contexto
  );
  assert.equal(sincronizados[0].usosMax, 3);
  assert.equal(sincronizados[0].usosGastos, 3);
  assert.deepEqual(
    recursos.sincronizarRecursosCatalogo(
      sincronizados,
      [definicao],
      { ...comTalento, habilidades: [] },
      contexto
    ),
    []
  );
});

test("recurso manual não é restaurado por descansos", () => {
  const marcador = [{ id: "inspiracao", usosMax: 1, usosGastos: 1, restauraEm: "manual" }];
  assert.equal(recursos.restaurarRecursos(marcador, "curto")[0].usosGastos, 1);
  assert.equal(recursos.restaurarRecursos(marcador, "longo")[0].usosGastos, 1);
});

test("eventos próprios não são confundidos com descanso longo", () => {
  const marcador = [{ id: "item", usosMax: 3, usosGastos: 2, restauraEm: "amanhecer" }];
  assert.equal(recursos.restaurarRecursos(marcador, "longo")[0].usosGastos, 2);
  assert.equal(recursos.restaurarRecursos(marcador, "amanhecer")[0].usosGastos, 0);
});
