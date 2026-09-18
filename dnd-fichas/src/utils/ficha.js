import { criarEspacosMagiaVazios } from "./magia";
import { normalizarPoolsDadosVida, totalDadosVidaUsados } from "./dadosVida";

export function criarFichaVazia(nome) {
  return {
    versaoFicha: 3,
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
    origemClassePvPorNivel: {},
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
    dadosDeVidaUsados: 0, // legado: mantido como total dos pools
    dadosVidaPorClasse: {},
    proficienciasArmas: [],
    proficienciasArmaduras: [],
    proficienciasEscudos: false,
    proficienciasMulticlasse: {},
    niveisAsiAplicados: [],
    magias: [],
    espacosMagia: criarEspacosMagiaVazios(),
    espacosMagiaPacto: null, // { quantidade, nivel, usados } — Bruxo, sempre separado
    concentracao: null, // { magiaId, nome } | null — magia de concentração ativa agora
    habilidades: [],
    ataques: [],
  };
}


// Migração conservadora: acrescenta os campos estruturais sem apagar escolhas
// antigas, magias, recursos ou campos personalizados.
export function normalizarFicha(ficha) {
  if (!ficha || typeof ficha !== "object") return ficha;
  const base = {
    ...ficha,
    versaoFicha: Math.max(Number(ficha.versaoFicha) || 1, 3),
    subclasseId: ficha.subclasseId ?? null,
    classesSecundarias: Array.isArray(ficha.classesSecundarias)
      ? ficha.classesSecundarias.map((classe) => ({
          ...classe,
          subclasseId: classe?.subclasseId ?? null,
        }))
      : [],
    proficienciasArmas: Array.isArray(ficha.proficienciasArmas) ? ficha.proficienciasArmas : [],
    proficienciasArmaduras: Array.isArray(ficha.proficienciasArmaduras) ? ficha.proficienciasArmaduras : [],
    proficienciasEscudos: Boolean(ficha.proficienciasEscudos),
    proficienciasMulticlasse:
      ficha.proficienciasMulticlasse && typeof ficha.proficienciasMulticlasse === "object"
        ? ficha.proficienciasMulticlasse
        : {},
  };
  const dadosVidaPorClasse = normalizarPoolsDadosVida(base);
  const origemClassePvPorNivel = {
    ...(ficha.origemClassePvPorNivel ?? {}),
  };
  // Fichas antigas não guardavam a origem do ganho de PV. Para preservar os
  // valores já salvos, atribuímos essas entradas à classe principal; somente
  // ganhos futuros passam a registrar a classe que realmente subiu.
  for (const nivel of Object.keys(base.pvPorNivel ?? {})) {
    origemClassePvPorNivel[nivel] ??= base.classeId ?? null;
  }
  return {
    ...base,
    origemClassePvPorNivel,
    dadosVidaPorClasse,
    dadosDeVidaUsados: totalDadosVidaUsados(dadosVidaPorClasse),
  };
}
