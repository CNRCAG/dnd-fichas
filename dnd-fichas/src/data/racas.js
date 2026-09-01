// Raças do manual básico (PHB), com os bônus de atributo padrão.
// Meio-Elfo simplificado: na regra oficial o jogador escolhe livremente
// 2 atributos para +1; aqui fixamos Destreza e Sabedoria para manter o
// formulário simples por enquanto.
export const RACAS = [
  {
    id: "humano",
    nome: "Humano",
    bonusAtributos: {
      forca: 1,
      destreza: 1,
      constituicao: 1,
      inteligencia: 1,
      sabedoria: 1,
      carisma: 1,
    },
    deslocamento: 9,
  },
  {
    id: "elfo",
    nome: "Elfo",
    bonusAtributos: { destreza: 2 },
    deslocamento: 9,
  },
  {
    id: "anao",
    nome: "Anão",
    bonusAtributos: { constituicao: 2 },
    deslocamento: 7,
  },
  {
    id: "halfling",
    nome: "Halfling",
    bonusAtributos: { destreza: 2 },
    deslocamento: 7,
  },
  {
    id: "draconato",
    nome: "Draconato",
    bonusAtributos: { forca: 2, carisma: 1 },
    deslocamento: 9,
  },
  {
    id: "gnomo",
    nome: "Gnomo",
    bonusAtributos: { inteligencia: 2 },
    deslocamento: 7,
  },
  {
    id: "meio-elfo",
    nome: "Meio-Elfo",
    bonusAtributos: { carisma: 2, destreza: 1, sabedoria: 1 },
    deslocamento: 9,
  },
  {
    id: "meio-orc",
    nome: "Meio-Orc",
    bonusAtributos: { forca: 2, constituicao: 1 },
    deslocamento: 9,
  },
  {
    id: "tiefling",
    nome: "Tiefling",
    bonusAtributos: { carisma: 2, inteligencia: 1 },
    deslocamento: 9,
  },
];

export function obterRaca(id) {
  return RACAS.find((raca) => raca.id === id) ?? null;
}
