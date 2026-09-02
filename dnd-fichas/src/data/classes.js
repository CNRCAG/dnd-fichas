// Classes do manual básico (PHB): dado de vida, atributo principal e as
// duas salvaguardas em que a classe é proficiente (fixas pela regra, o
// jogador não escolhe).
export const CLASSES = [
  {
    id: "barbaro",
    nome: "Bárbaro",
    dadoVida: 12,
    atributoPrincipal: "forca",
    salvaguardasProficientes: ["forca", "constituicao"],
  },
  {
    id: "bardo",
    nome: "Bardo",
    dadoVida: 8,
    atributoPrincipal: "carisma",
    salvaguardasProficientes: ["destreza", "carisma"],
  },
  {
    id: "bruxo",
    nome: "Bruxo",
    dadoVida: 8,
    atributoPrincipal: "carisma",
    salvaguardasProficientes: ["sabedoria", "carisma"],
  },
  {
    id: "clerigo",
    nome: "Clérigo",
    dadoVida: 8,
    atributoPrincipal: "sabedoria",
    salvaguardasProficientes: ["sabedoria", "carisma"],
  },
  {
    id: "druida",
    nome: "Druida",
    dadoVida: 8,
    atributoPrincipal: "sabedoria",
    salvaguardasProficientes: ["inteligencia", "sabedoria"],
  },
  {
    id: "feiticeiro",
    nome: "Feiticeiro",
    dadoVida: 6,
    atributoPrincipal: "carisma",
    salvaguardasProficientes: ["constituicao", "carisma"],
  },
  {
    id: "guerreiro",
    nome: "Guerreiro",
    dadoVida: 10,
    atributoPrincipal: "forca",
    salvaguardasProficientes: ["forca", "constituicao"],
  },
  {
    id: "ladino",
    nome: "Ladino",
    dadoVida: 8,
    atributoPrincipal: "destreza",
    salvaguardasProficientes: ["destreza", "inteligencia"],
  },
  {
    id: "mago",
    nome: "Mago",
    dadoVida: 6,
    atributoPrincipal: "inteligencia",
    salvaguardasProficientes: ["inteligencia", "sabedoria"],
  },
  {
    id: "monge",
    nome: "Monge",
    dadoVida: 8,
    atributoPrincipal: "destreza",
    salvaguardasProficientes: ["forca", "destreza"],
  },
  {
    id: "paladino",
    nome: "Paladino",
    dadoVida: 10,
    atributoPrincipal: "forca",
    salvaguardasProficientes: ["sabedoria", "carisma"],
  },
  {
    id: "patrulheiro",
    nome: "Patrulheiro",
    dadoVida: 10,
    atributoPrincipal: "destreza",
    salvaguardasProficientes: ["forca", "destreza"],
  },
];

export function obterClasse(id) {
  return CLASSES.find((classe) => classe.id === id) ?? null;
}
