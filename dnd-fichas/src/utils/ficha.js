import { criarEspacosMagiaVazios } from "./magia";

export function criarFichaVazia(nome) {
  return {
    versaoFicha: 2,
    id: crypto.randomUUID(),
    nome: nome?.trim() || "Sem nome",
    criadoEm: Date.now(),
    notas: "",
    jogador: "",
    aparencia: "",
    personalidade: "",
    historico: "",
    objetivo: "",
    racaId: null,
    classeId: null,
    antecedenteId: null,
    nivel: 1,
    atributos: {
      forca: 10,
      destreza: 10,
      constituicao: 10,
      inteligencia: 10,
      sabedoria: 10,
      carisma: 10,
    },
    pericias: {},
    inventario: [],
    moedas: {
      cobre: 0,
      prata: 0,
      electro: 0,
      ouro: 0,
      platina: 0,
    },
    status: {
      pvAtual: 10,
      pvMax: 10,
      pvTemp: 0,               // NOVO
      ca: 10,
      iniciativa: 0,
      deslocamento: 9,
      testesMorteSucessos: 0,  // NOVO
      testesMorteFalhas: 0,    // NOVO
    },
        pvPorNivel: {},
    progressao: {
      modo: "marco", // "marco" | "xp"
      xpAtual: 0,
    },
    recursos: [],
    subclasseId: null,
    bonusRacialEscolhido: [], // atributos escolhidos livremente (ex: Meio-Elfo)
    periciasDoAntecedente: [], // rastreia quais perícias vieram do antecedente atual
    idiomas: ["comum"],
    proficienciasFerramentas: [], // ids de FERRAMENTAS (data/equipamentos.js) em que é proficiente
    atributoFerramentas: {}, // { [ferramentaId]: chaveDoAtributo } — atributo usado em cada rolagem
    classesSecundarias: [], // [{ classeId, nivel, subclasseId }] — multiclasse
    dadosDeVidaUsados: 0,
    niveisAsiAplicados: [],
    magias: [],
    espacosMagia: criarEspacosMagiaVazios(),
    espacosMagiaPacto: null, // { quantidade, nivel, usados } — Bruxo, sempre separado
    concentracao: null, // { magiaId, nome } | null — magia de concentração ativa agora
    habilidades: [],
    ataques: [],
  };
}


// Migração conservadora: adiciona somente os campos de estrutura que a
// versão atual precisa para subclasses em multiclasse, sem apagar escolhas
// antigas, magias, recursos ou campos personalizados.
export function normalizarFicha(ficha) {
  if (!ficha || typeof ficha !== "object") return ficha;
  return {
    ...ficha,
    versaoFicha: Math.max(Number(ficha.versaoFicha) || 1, 2),
    subclasseId: ficha.subclasseId ?? null,
    classesSecundarias: Array.isArray(ficha.classesSecundarias)
      ? ficha.classesSecundarias.map((classe) => ({
          ...classe,
          subclasseId: classe?.subclasseId ?? null,
        }))
      : [],
  };
}
