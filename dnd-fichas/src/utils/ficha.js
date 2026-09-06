import { criarEspacosMagiaVazios } from "./magia";

export function criarFichaVazia(nome) {
  return {
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
    dadosDeVidaUsados: 0,
    niveisAsiAplicados: [],
    magias: [],
    espacosMagia: criarEspacosMagiaVazios(),
    habilidades: [],
    ataques: [],
  };
}
