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

test("subclasses liberam magias no nível correto", () => {
  const vida = {
    ...ficha("clerigo", 1),
    subclasseId: "dominio-vida",
  };

  const corruptor4 = {
    ...ficha("bruxo", 4),
    subclasseId: "patrono-corruptor",
  };
  const corruptor5 = { ...corruptor4, nivel: 5 };

  assert.deepEqual(
    acesso.classesElegiveisParaMagia(vida, {
      id: "bencao",
      nivel: 1,
    }).map(({ classeId }) => classeId),
    ["clerigo"]
  );

  assert.equal(
    acesso.classesElegiveisParaMagia(corruptor4, {
      id: "bola-de-fogo",
      nivel: 3,
    }).length,
    0
  );

  assert.deepEqual(
    acesso.classesElegiveisParaMagia(corruptor5, {
      id: "bola-de-fogo",
      nivel: 3,
    }).map(({ classeId }) => classeId),
    ["bruxo"]
  );
});
test("conjuração parcial usa tabela própria e contribuição multiclasse", async () => {
  const conjuracao = await servidor.ssrLoadModule("/src/utils/conjuracao.js");

  assert.equal(
    conjuracao.obterEspacosPorNivel("guerreiro", 3, "cavaleiro-arcano")[1],
    2
  );
  assert.equal(
    conjuracao.obterEspacosPorNivel("guerreiro", 7, "cavaleiro-arcano")[2],
    2
  );

  const combinado = conjuracao.obterEspacosCombinadosMulticlasse([
    { classeId: "guerreiro", nivel: 3, subclasseId: "cavaleiro-arcano" },
    { classeId: "mago", nivel: 2 },
  ]);

  assert.equal(combinado.espacosRegulares[1], 4);
  assert.equal(combinado.espacosRegulares[2], 2);
});

test("conjuração parcial acessa magias pelo nível da própria classe", () => {
  const magia = (id) => catalogo.MAGIAS.find((item) => item.id === id);
  const classesElegiveis = (personagem, id) =>
    acesso
      .classesElegiveisParaMagia(personagem, magia(id))
      .map(({ classeId }) => classeId);

  const cavaleiro2 = {
    ...ficha("guerreiro", 2),
    subclasseId: "cavaleiro-arcano",
  };
  const cavaleiro3 = { ...cavaleiro2, nivel: 3 };
  const cavaleiro7 = { ...cavaleiro2, nivel: 7 };

  assert.deepEqual(classesElegiveis(cavaleiro2, "escudo"), []);
  assert.deepEqual(classesElegiveis(cavaleiro3, "escudo"), ["guerreiro"]);
  assert.deepEqual(classesElegiveis(cavaleiro3, "faisca"), ["guerreiro"]);
  assert.deepEqual(classesElegiveis(cavaleiro3, "raio-ardente"), []);
  assert.deepEqual(classesElegiveis(cavaleiro7, "raio-ardente"), ["guerreiro"]);

  const trapaceiro3 = {
    ...ficha("ladino", 3),
    subclasseId: "trapaceiro-arcano",
  };
  assert.deepEqual(classesElegiveis(trapaceiro3, "maos-magicas"), ["ladino"]);
  assert.deepEqual(classesElegiveis(trapaceiro3, "enfeiticar-pessoa"), ["ladino"]);
  assert.deepEqual(classesElegiveis(trapaceiro3, "curar-ferimentos"), []);
});

test("limites de magias das subclasses com conjuração parcial", () => {
  assert.equal(
    limites.limitesMagiasDaClasse("guerreiro", 3, atributos),
    null
  );

  assert.deepEqual(
    limites.limitesMagiasDaClasse(
      "guerreiro",
      3,
      atributos,
      "cavaleiro-arcano"
    ),
    { truques: 2, conhecidas: 3, preparadas: null }
  );

  assert.deepEqual(
    limites.limitesMagiasDaClasse(
      "ladino",
      10,
      atributos,
      "trapaceiro-arcano"
    ),
    { truques: 4, conhecidas: 7, preparadas: null }
  );

  assert.deepEqual(
    limites.limitesMagiasDaClasse(
      "guerreiro",
      20,
      atributos,
      "cavaleiro-arcano"
    ),
    { truques: 3, conhecidas: 13, preparadas: null }
  );
});

test("atributo de conjuração respeita classe, subclasse e nível", async () => {
  const conjuracao = await servidor.ssrLoadModule("/src/utils/conjuracao.js");
  const atributo = conjuracao.obterAtributoConjuracao;

  assert.equal(atributo("guerreiro", "cavaleiro-arcano", 2), null);
  assert.equal(atributo("guerreiro", "cavaleiro-arcano", 3), "inteligencia");
  assert.equal(atributo("ladino", "trapaceiro-arcano", 3), "inteligencia");
  assert.equal(atributo("guerreiro", null, 20), null);
  assert.equal(atributo("paladino", null, 1), null);
  assert.equal(atributo("paladino", null, 2), "carisma");
  assert.equal(atributo("patrulheiro", null, 2), "sabedoria");
  assert.equal(atributo("mago", null, 1), "inteligencia");
});

test("escolhas livres de escolas respeitam os marcos da conjuração parcial", () => {
  assert.deepEqual(
    [2, 3, 7, 8, 13, 14, 19, 20].map(acesso.limiteMagiasDeQualquerEscola),
    [0, 1, 1, 2, 2, 3, 3, 4]
  );
  const magia = (id) => catalogo.MAGIAS.find((item) => item.id === id);
  const cavaleiro3 = { ...ficha("guerreiro", 3), subclasseId: "cavaleiro-arcano" };
  const detectar = magia("detectar-magia");

  assert.deepEqual(
    acesso.classesElegiveisParaMagia(cavaleiro3, detectar, true).map((item) => item.classeId),
    ["guerreiro"]
  );

  const cavaleiroComEscolhaLivre = {
    ...cavaleiro3,
    magias: [{ id: "1", origemId: detectar.id, nome: detectar.nome, nivel: 1, classeId: "guerreiro" }],
  };
  assert.deepEqual(acesso.classesElegiveisParaMagia(cavaleiroComEscolhaLivre, magia("identificar"), true), []);
  assert.deepEqual(
    acesso.classesElegiveisParaMagia({ ...cavaleiroComEscolhaLivre, nivel: 8 }, magia("identificar"), true)
      .map((item) => item.classeId),
    ["guerreiro"]
  );
  assert.deepEqual(
    acesso.classesElegiveisParaMagia(cavaleiroComEscolhaLivre, detectar)
      .map((item) => item.classeId),
    ["guerreiro"]
  );

  const trapaceiro3 = { ...ficha("ladino", 3), subclasseId: "trapaceiro-arcano" };
  assert.deepEqual(
    acesso.classesElegiveisParaMagia(trapaceiro3, magia("detectar-magia"), true)
      .map((item) => item.classeId),
    ["ladino"]
  );
  const trapaceiroComEscolhaLivre = {
    ...trapaceiro3,
    magias: [{ id: "2", origemId: detectar.id, nome: detectar.nome, nivel: 1, classeId: "ladino" }],
  };
  assert.deepEqual(acesso.classesElegiveisParaMagia(trapaceiroComEscolhaLivre, magia("identificar"), true), []);
  assert.deepEqual(
    acesso.classesElegiveisParaMagia(trapaceiroComEscolhaLivre, magia("maos-magicas"), true)
      .map((item) => item.classeId),
    ["ladino"]
  );
});

test("validação confere limites e escolas de Cavaleiro Arcano e Trapaceiro Arcano", () => {
  const criarMagia = (id, classeId) => {
    const magia = catalogo.MAGIAS.find((item) => item.id === id);
    return { id: `${classeId}-${id}`, origemId: id, nome: magia.nome, nivel: magia.nivel, classeId };
  };
  const cavaleiro = {
    ...ficha("guerreiro", 3, [
      criarMagia("detectar-magia", "guerreiro"),
      criarMagia("identificar", "guerreiro"),
      criarMagia("escudo", "guerreiro"),
      criarMagia("misseis-magicos", "guerreiro"),
    ]),
    subclasseId: "cavaleiro-arcano",
  };
  const avisosCavaleiro = validacao.validarFicha(cavaleiro, atributos).avisos;
  assert.ok(avisosCavaleiro.some((aviso) => aviso.includes("4 magias conhecidas")));
  assert.ok(avisosCavaleiro.some((aviso) => aviso.includes("2 magias de outras escolas")));

  const trapaceiro = {
    ...ficha("ladino", 3, [criarMagia("sono", "ladino")]),
    subclasseId: "trapaceiro-arcano",
  };
  assert.ok(
    validacao.validarFicha(trapaceiro, atributos).avisos.some((aviso) => aviso.includes("Mãos Mágicas"))
  );
  assert.equal(
    validacao.validarFicha({
      ...trapaceiro,
      magias: [...trapaceiro.magias, criarMagia("maos-magicas", "ladino")],
    }, atributos).avisos.some((aviso) => aviso.includes("adicione o truque Mãos Mágicas")),
    false
  );
});
