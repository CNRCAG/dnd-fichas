import { criarEspacosMagiaVazios } from "./magia";

export function criarFichaVazia(nome) {
  return {
    id: crypto.randomUUID(),
    nome: nome?.trim() || "Sem nome",
    criadoEm: Date.now(),
    notas: "",
    racaId: null,
    classeId: null,
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
      ca: 10,
      iniciativa: 0,
      deslocamento: 9,
    },
    magias: [],
    espacosMagia: criarEspacosMagiaVazios(),
  };
}
