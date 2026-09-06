// Raças do manual básico (PHB), com os bônus de atributo padrão.
// Meio-Elfo simplificado: na regra oficial o jogador escolhe livremente
// 2 atributos para +1; aqui fixamos Destreza e Sabedoria para manter o
// formulário simples por enquanto.
export const RACAS = [
  {
    id: "humano",
    nome: "Humano",
    descricao: "Versáteis e adaptáveis, ganham um pequeno bônus em todos os atributos.",
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
    descricao: "Ágeis e de sentidos apurados, com longevidade e afinidade natural com magia.",
    bonusAtributos: { destreza: 2 },
    deslocamento: 9,
  },
  {
    id: "anao",
    nome: "Anão",
    descricao: "Resistentes e teimosos, vêm de uma tradição de mineração e forja.",
    bonusAtributos: { constituicao: 2 },
    deslocamento: 7,
  },
  {
    id: "halfling",
    nome: "Halfling",
    descricao: "Pequenos, sortudos e surpreendentemente corajosos apesar do tamanho.",
    bonusAtributos: { destreza: 2 },
    deslocamento: 7,
  },
  {
    id: "draconato",
    nome: "Draconato",
    descricao: "Descendentes de dragões, com presença imponente e sopro elemental.",
    bonusAtributos: { forca: 2, carisma: 1 },
    deslocamento: 9,
  },
  {
    id: "gnomo",
    nome: "Gnomo",
    descricao: "Curiosos e inventivos, com uma mente afiada pra mecanismos e magia.",
    bonusAtributos: { inteligencia: 2 },
    deslocamento: 7,
  },
  {
    id: "meio-elfo",
    nome: "Meio-Elfo",
    descricao: "Misturam a graça élfica com a versatilidade humana, sem se encaixar totalmente em nenhum dos dois mundos.",
    bonusAtributos: { carisma: 2, destreza: 1, sabedoria: 1 },
    deslocamento: 9,
  },
  {
    id: "meio-orc",
    nome: "Meio-Orc",
    descricao: "Fortes e resilientes, com uma ferocidade que os torna temíveis em combate.",
    bonusAtributos: { forca: 2, constituicao: 1 },
    deslocamento: 9,
  },
  {
    id: "tiefling",
    nome: "Tiefling",
    descricao: "Marcados por uma ascendência infernal distante, carismáticos e resistentes a fogo.",
    bonusAtributos: { carisma: 2, inteligencia: 1 },
    deslocamento: 9,
  },
];

export function obterRaca(id) {
  return RACAS.find((raca) => raca.id === id) ?? null;
}
