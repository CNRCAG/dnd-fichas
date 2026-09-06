// Classes do manual básico (PHB): dado de vida, atributo principal e as
// duas salvaguardas em que a classe é proficiente (fixas pela regra, o
// jogador não escolhe).
export const CLASSES = [
  {
    id: "barbaro",
    nome: "Bárbaro",
    descricao: "Guerreiro primitivo que canaliza fúria bruta em combate.",
    dadoVida: 12,
    atributoPrincipal: "forca",
    salvaguardasProficientes: ["forca", "constituicao"],
  },
  {
    id: "bardo",
    nome: "Bardo",
    descricao: "Conjurador versátil que usa música e carisma como armas.",
    dadoVida: 8,
    atributoPrincipal: "carisma",
    salvaguardasProficientes: ["destreza", "carisma"],
  },
  {
    id: "bruxo",
    nome: "Bruxo",
    descricao: "Conjurador que trocou favores com um patrono sobrenatural por poder.",
    dadoVida: 8,
    atributoPrincipal: "carisma",
    salvaguardasProficientes: ["sabedoria", "carisma"],
  },
  {
    id: "clerigo",
    nome: "Clérigo",
    descricao: "Canal de poder divino, cura aliados e pune inimigos em nome de uma divindade.",
    dadoVida: 8,
    atributoPrincipal: "sabedoria",
    salvaguardasProficientes: ["sabedoria", "carisma"],
  },
  {
    id: "druida",
    nome: "Druida",
    descricao: "Guardião da natureza, capaz de assumir formas animais e conjurar magia natural.",
    dadoVida: 8,
    atributoPrincipal: "sabedoria",
    salvaguardasProficientes: ["inteligencia", "sabedoria"],
  },
  {
    id: "feiticeiro",
    nome: "Feiticeiro",
    descricao: "Conjurador que nasceu com magia correndo nas veias.",
    dadoVida: 6,
    atributoPrincipal: "carisma",
    salvaguardasProficientes: ["constituicao", "carisma"],
  },
  {
    id: "guerreiro",
    nome: "Guerreiro",
    descricao: "Mestre em combate, versátil com quase qualquer arma ou armadura.",
    dadoVida: 10,
    atributoPrincipal: "forca",
    salvaguardasProficientes: ["forca", "constituicao"],
  },
  {
    id: "ladino",
    nome: "Ladino",
    descricao: "Especialista em furtividade, precisão e resolver problemas por vias criativas.",
    dadoVida: 8,
    atributoPrincipal: "destreza",
    salvaguardasProficientes: ["destreza", "inteligencia"],
  },
  {
    id: "mago",
    nome: "Mago",
    descricao: "Estudioso da magia arcana, aprendida através de anos de estudo.",
    dadoVida: 6,
    atributoPrincipal: "inteligencia",
    salvaguardasProficientes: ["inteligencia", "sabedoria"],
  },
  {
    id: "monge",
    nome: "Monge",
    descricao: "Combatente que canaliza energia interior (ki) em golpes precisos e ágeis.",
    dadoVida: 8,
    atributoPrincipal: "destreza",
    salvaguardasProficientes: ["forca", "destreza"],
  },
  {
    id: "paladino",
    nome: "Paladino",
    descricao: "Guerreiro sagrado, ligado por um juramento que concede poderes divinos.",
    dadoVida: 10,
    atributoPrincipal: "forca",
    salvaguardasProficientes: ["sabedoria", "carisma"],
  },
  {
    id: "patrulheiro",
    nome: "Patrulheiro",
    descricao: "Caçador e explorador, combina combate com magia da natureza e rastreamento.",
    dadoVida: 10,
    atributoPrincipal: "destreza",
    salvaguardasProficientes: ["forca", "destreza"],
  },
];

export function obterClasse(id) {
  return CLASSES.find((classe) => classe.id === id) ?? null;
}
