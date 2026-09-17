import { after, before, test } from "node:test";
import assert from "node:assert/strict";
import { createServer } from "vite";

let servidor;
let acesso;
let validacao;
let limites;
let catalogo;
let listas;

before(async () => {
  servidor = await createServer({ server: { middlewareMode: true }, appType: "custom" });
  acesso = await servidor.ssrLoadModule("/src/utils/acessoMagias.js");
  validacao = await servidor.ssrLoadModule("/src/utils/validacaoFicha.js");
  limites = await servidor.ssrLoadModule("/src/data/limitesMagias.js");
  catalogo = await servidor.ssrLoadModule("/src/data/magiasSistema.js");
  listas = await servidor.ssrLoadModule("/src/data/magiasClasses.js");
});

after(async () => { await servidor?.close(); });

const atributos = {
  forca: 13, destreza: 13, constituicao: 12,
  inteligencia: 16, sabedoria: 16, carisma: 16,
};

function ficha(classeId, nivel, magias = [], classesSecundarias = []) {
  return {
    racaId: "humano", classeId, nivel, antecedenteId: "acolito",
    classesSecundarias, magias,
    status: { pvMax: 10, pvAtual: 10, pvTemp: 0 },
  };
}

test("espaços combinados não liberam magia fora do nível da classe", () => {
  const personagem = ficha("mago", 3, [], [{ classeId: "clerigo", nivel: 2 }]);
  assert.deepEqual(acesso.classesElegiveisParaMagia(personagem, { id: "bola-de-fogo", nivel: 3 }), []);
  assert.deepEqual(acesso.classesElegiveisParaMagia(personagem, { id: "curar-ferimentos", nivel: 1 }).map((item) => item.classeId), ["clerigo"]);
});

test("lista da classe filtra magias mesmo com círculo acessível", () => {
  assert.deepEqual(acesso.classesElegiveisParaMagia(ficha("clerigo", 5), { id: "bola-de-fogo", nivel: 3 }), []);
  assert.deepEqual(acesso.classesElegiveisParaMagia(ficha("mago", 5), { id: "bola-de-fogo", nivel: 3 }).map((item) => item.classeId), ["mago"]);
});

test("todas as magias do catálogo têm pelo menos uma classe básica", () => {
  for (const magia of catalogo.MAGIAS) {
    assert.ok(listas.classesDaMagia(magia.id).length > 0, magia.nome);
  }
  assert.equal(catalogo.MAGIAS.find((magia) => magia.id === "contagio").nivel, 5);
});

test("avisos identificam lista incorreta, excesso de conhecidas e preparação", () => {
  const magiasFeiticeiro = ["escudo", "misseis-magicos", "sono"].map((origemId, indice) => ({
    id: String(indice), origemId,
    nome: { escudo: "Escudo", "misseis-magicos": "Mísseis Mágicos", sono: "Sono" }[origemId],
    nivel: 1, classeId: "feiticeiro", preparada: false,
  }));
  const avisosFeiticeiro = validacao.validarFicha(ficha("feiticeiro", 1, magiasFeiticeiro), atributos).avisos;
  assert.ok(avisosFeiticeiro.some((aviso) => aviso.includes("3 magias conhecidas")));

  const clerigo = ficha("clerigo", 1, [{
    id: "1", origemId: "bola-de-fogo", nome: "Bola de Fogo", nivel: 3,
    classeId: "clerigo", preparada: true,
  }]);
  const avisosClerigo = validacao.validarFicha(clerigo, atributos).avisos;
  assert.ok(avisosClerigo.some((aviso) => aviso.includes("não pertence à lista")));
  assert.ok(avisosClerigo.some((aviso) => aviso.includes("não é acessível")));

  assert.equal(limites.limitesMagiasDaClasse("clerigo", 1, atributos).preparadas, 4);
  assert.equal(limites.limitesMagiasDaClasse("paladino", 2, atributos).preparadas, 4);
});

test("Arcano Místico usa progressão própria e não conta como magia de Pacto conhecida", () => {
  const bruxo = ficha("bruxo", 11, [{
    id: "1", origemId: "verdadeira-visao", nome: "Verdadeira Visão",
    nivel: 6, classeId: "bruxo", preparada: false,
  }]);
  assert.equal(acesso.classesQueAcessamNivel(bruxo, 6).length, 1);
  assert.equal(acesso.classesQueAcessamNivel(ficha("bruxo", 10), 6).length, 0);
  assert.equal(validacao.validarFicha(bruxo, atributos).avisos.some((aviso) => aviso.includes("espaço disponível")), false);
});
