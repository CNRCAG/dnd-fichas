import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

let servidor, fichaUtils, criacao, validacao, regras, catalogo;
const atributos = { forca: 13, destreza: 14, constituicao: 14, inteligencia: 14, sabedoria: 14, carisma: 14 };

function fichaBase(extra = {}) {
  return {
    nome: "Aria", racaId: "elfo", classeId: "bardo", antecedenteId: "acolito", nivel: 1,
    atributos, status: { pvMax: 10, pvAtual: 10, pvTemp: 0 }, espacosMagia: {},
    escolhasCriacao: { periciasClasse: ["acrobacia", "atuacao", "arcanismo"], ferramentasClasse: ["alaude", "flauta", "tambor"], idiomasAntecedente: ["anao", "gnomico"] },
    ...extra,
  };
}

before(async () => {
  servidor = await createServer({ server: { middlewareMode: true, hmr: false }, appType: "custom" });
  fichaUtils = await servidor.ssrLoadModule("/src/utils/ficha.js");
  criacao = await servidor.ssrLoadModule("/src/utils/proficienciasCriacao.js");
  validacao = await servidor.ssrLoadModule("/src/utils/validacaoFicha.js");
  regras = await servidor.ssrLoadModule("/src/utils/regrasMagias.js");
  catalogo = await servidor.ssrLoadModule("/src/data/magiasSistema.js");
});
after(async () => servidor?.close());

test("validação final: rascunho, pronta, aviso e normalização idempotente", () => {
  const pronta = fichaUtils.normalizarFicha(fichaBase());
  assert.equal(validacao.validarFicha(pronta, atributos).pronta, true);
  assert.equal(validacao.validarFicha(fichaBase({ nome: "" }), atributos).pendencias.length > 0, true);
  assert.equal(validacao.validarFicha(fichaBase({ status: { pvMax: 4, pvAtual: 5, pvTemp: 0 } }), atributos).erros.length > 0, true);
  const aviso = validacao.validarFicha(fichaBase({ magias: [{ id: "m", nome: "Ritual da mesa", nivel: 1, classeId: "especial", fonteEspecial: "Regra da mesa" }] }), atributos);
  assert.equal(aviso.avisos.length > 0, true);
  const uma = fichaUtils.normalizarFicha(fichaBase({ status: { pvMax: 5, pvAtual: 99, pvTemp: -1 } }));
  assert.deepEqual(fichaUtils.normalizarFicha(uma), uma);
});

test("migração preserva dados legados e reduz apenas valores inequivocamente inválidos", () => {
  const antiga = fichaUtils.normalizarFicha({ ...fichaBase(), versaoFicha: 1, pericias: { furtividade: true }, idiomas: ["comum", "silvestre"], status: { pvMax: 10, pvAtual: 50, pvTemp: -5 } });
  assert.equal(antiga.pericias.furtividade, true);
  assert.deepEqual(antiga.idiomas.includes("silvestre"), true);
  assert.equal(antiga.status.pvAtual, 10);
  assert.equal(antiga.status.pvTemp, 0);
});

test("proficiências iniciais de cada classe usam regras centralizadas e multiclasse não as replica", () => {
  for (const classeId of ["barbaro", "bardo", "bruxo", "clerigo", "druida", "feiticeiro", "guerreiro", "ladino", "mago", "monge", "paladino", "patrulheiro"]) {
    const ficha = criacao.reconciliarProficienciasCriacao(fichaBase({ classeId, escolhasCriacao: { periciasClasse: [] } }));
    assert.equal(ficha.salvaguardasProficientes.length, 2, classeId);
  }
  const guerreiro = criacao.reconciliarProficienciasCriacao(fichaBase({ classeId: "guerreiro", escolhasCriacao: { periciasClasse: ["atletismo", "historia"] } }));
  assert.equal(guerreiro.proficienciasArmas.includes("marciais"), true);
  assert.equal(guerreiro.proficienciasArmaduras.includes("pesadas"), true);
});

test("escolhas de criação exigem quantidade, lista válida e preservam manual ao trocar origem", () => {
  const pendencias = criacao.escolhasObrigatoriasCriacao(fichaBase({ escolhasCriacao: {} }));
  assert.equal(pendencias.some((item) => item.mensagem.includes("Perícias da classe")), true);
  const comManual = criacao.reconciliarProficienciasCriacao(fichaBase({ pericias: { furtividade: true }, escolhasCriacao: { periciasClasse: ["acrobacia", "atuacao", "arcanismo"], idiomasAntecedente: ["anao", "gnomico"] } }));
  const trocada = criacao.reconciliarProficienciasCriacao({ ...comManual, antecedenteId: "soldado", escolhasCriacao: { ...comManual.escolhasCriacao, idiomasAntecedente: [] } });
  assert.equal(trocada.pericias.furtividade, true);
});

test("raças e antecedentes concedem idiomas/ferramentas por origem", () => {
  const ficha = criacao.reconciliarProficienciasCriacao(fichaBase({ racaId: "meio-elfo", antecedenteId: "eremita", escolhasCriacao: { periciasClasse: ["acrobacia", "atuacao", "arcanismo"], periciasRaca: ["furtividade", "percepcao"], idiomasRaca: ["silvestre"], idiomasAntecedente: ["anao"] } }));
  assert.equal(ficha.idiomas.includes("elfico"), true);
  assert.equal(ficha.proficienciasFerramentas.includes("kit-ervanario"), true);
  assert.equal(ficha.origensProficiencias.pericias.furtividade.some((origem) => origem.startsWith("raca:")), true);
});

test("Segredos Mágicos: nível individual, limite, multiclasse e origem", () => {
  const bola = catalogo.MAGIAS.find((magia) => magia.id === "bola-de-fogo");
  const bardo9 = fichaBase({ nivel: 9 });
  const bardo10 = fichaBase({ nivel: 10, classesSecundarias: [{ classeId: "mago", nivel: 10 }] });
  assert.equal(regras.limiteSegredosMagicos(bardo9, "bardo"), 0);
  assert.equal(regras.limiteSegredosMagicos(bardo10, "bardo"), 2);
  assert.equal(regras.magiaElegivelPorSegredo(bardo10, "bardo", bola), true);
  const muitos = { ...bardo10, magias: [0, 1, 2].map((id) => ({ id: String(id), origemId: bola.id, nome: bola.nome, nivel: bola.nivel, classeId: "especial", origemEspecial: { tipo: "segredos-magicos", classeId: "bardo" } })) };
  assert.equal(validacao.validarFicha(muitos, atributos).erros.some((texto) => texto.includes("Segredos Mágicos")), true);
});

test("origens de talento, item e regra da mesa são verificadas sem contar como classe", () => {
  const magia = catalogo.MAGIAS.find((item) => item.id === "escudo");
  const talento = fichaBase({ habilidades: [{ tipo: "talento", origemId: "iniciado-magia" }], magias: [{ id: "m", origemId: magia.id, nome: magia.nome, nivel: 1, classeId: "especial", origemEspecial: { tipo: "talento", fonteId: "iniciado-magia", classeLista: "mago" } }] });
  assert.equal(validacao.validarFicha(talento, atributos).pendencias.length, 0);
  const semItem = fichaBase({ magias: [{ id: "m", origemId: magia.id, nome: magia.nome, nivel: 1, classeId: "especial", origemEspecial: { tipo: "item", fonteId: "nao-existe" } }] });
  assert.equal(validacao.validarFicha(semItem, atributos).pendencias.length > 0, true);
  const semFonte = fichaBase({ magias: [{ id: "m", nome: "Efeito especial", nivel: 1, classeId: "especial", origemEspecial: { tipo: "manual" } }] });
  assert.equal(validacao.validarFicha(semFonte, atributos).pendencias.length > 0, true);
});

test("troca de magia: classes elegíveis, especiais protegidas e histórico por nível", () => {
  const escudo = catalogo.MAGIAS.find((magia) => magia.id === "escudo");
  const bardo = fichaBase({ nivel: 2, magias: [{ id: "m", origemId: escudo.id, nome: escudo.nome, nivel: 1, classeId: "bardo" }] });
  assert.equal(regras.obterRegraTroca(bardo, "bardo", 2).quantidade, 1);
  assert.equal(regras.magiasElegiveisParaTroca(bardo, "bardo", 2).length, 1);
  const item = { ...bardo, magias: [{ id: "i", origemId: escudo.id, nome: escudo.nome, nivel: 1, classeId: "especial", origemEspecial: { tipo: "item", fonteId: "x" } }] };
  assert.equal(regras.magiasElegiveisParaTroca(item, "bardo", 2).length, 0);
  assert.equal(regras.obterRegraTroca(fichaBase({ classeId: "clerigo" }), "clerigo", 2), null);
});

test("catálogo mantém IDs únicos, listas coerentes e magias exigidas por subclasses", () => {
  assert.equal(new Set(catalogo.MAGIAS.map((magia) => magia.id)).size, catalogo.MAGIAS.length);
  for (const id of ["bencao", "curar-ferimentos", "bola-de-fogo", "maos-magicas", "banimento"]) assert.ok(catalogo.MAGIAS.some((magia) => magia.id === id));
});
