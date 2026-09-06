// Antecedentes do manual básico (PHB) — resumos com nossas próprias
// palavras. Cada um concede 2 perícias treinadas automaticamente,
// equipamento inicial (texto, não vira itens de verdade ainda) e uma
// característica narrativa.
export const ANTECEDENTES = [
  {
    id: "acolito",
    nome: "Acólito",
    descricao: "Passou a vida servindo em um templo, aprendendo rituais e doutrina.",
    periciasConcedidas: ["intuicao", "religiao"],
    equipamento: "Símbolo sagrado, livro de orações, roupas comuns, 15 po",
    caracteristica: {
      nome: "Refúgio do Templo",
      descricao: "Templos e casas de culto da sua fé te dão ajuda básica de graça.",
    },
  },
  {
    id: "criminoso",
    nome: "Criminoso",
    descricao: "Tem um histórico de quebrar a lei e viver à margem dela.",
    periciasConcedidas: ["enganacao", "furtividade"],
    equipamento: "Pé-de-cabra, roupas escuras com capuz, 15 po",
    caracteristica: {
      nome: "Contato Criminoso",
      descricao: "Você tem um contato confiável no submundo do crime, seu elo com uma rede de outros criminosos.",
    },
  },
  {
    id: "heroi-do-povo",
    nome: "Herói do Povo",
    descricao: "Vem de origem humilde, mas já fez algo que o tornou querido pela gente comum.",
    periciasConcedidas: ["adestrarAnimais", "sobrevivencia"],
    equipamento: "Kit de artesão, uma pá, roupas comuns, 10 po",
    caracteristica: {
      nome: "Hospitalidade Rústica",
      descricao: "Gente comum te esconde e ajuda, mesmo sob risco pessoal.",
    },
  },
  {
    id: "artesao-guildado",
    nome: "Artesão Guildado",
    descricao: "Aprendeu um ofício e é membro reconhecido de uma guilda de artesãos.",
    periciasConcedidas: ["intuicao", "persuasao"],
    equipamento: "Ferramentas do seu ofício, carta da guilda, roupas de viajante, 15 po",
    caracteristica: {
      nome: "Filiação à Guilda",
      descricao: "Membros da sua guilda te dão suporte, hospedagem e contatos em outras cidades.",
    },
  },
  {
    id: "eremita",
    nome: "Eremita",
    descricao: "Viveu isolado por um longo período, em busca de reflexão ou segredo.",
    periciasConcedidas: ["medicina", "religiao"],
    equipamento: "Kit de curandeiro, diário espiritual, roupas comuns, 5 po",
    caracteristica: {
      nome: "Descoberta",
      descricao: "Seu tempo em reclusão te revelou um grande segredo ou uma verdade oculta sobre o universo.",
    },
  },
  {
    id: "nobre",
    nome: "Nobre",
    descricao: "Nasceu em berço de riqueza, privilégio e poder.",
    periciasConcedidas: ["historia", "persuasao"],
    equipamento: "Roupas finas, um anel de sinete, 25 po",
    caracteristica: {
      nome: "Posição Privilegiada",
      descricao: "Sua origem nobre abre portas — as pessoas assumem que você tem autoridade e o direito de estar em qualquer lugar.",
    },
  },
  {
    id: "sabio",
    nome: "Sábio",
    descricao: "Passou anos estudando os segredos do universo em bibliotecas e academias.",
    periciasConcedidas: ["arcanismo", "historia"],
    equipamento: "Tinteiro, livro sobre um tema que você estuda, roupas comuns, 10 po",
    caracteristica: {
      nome: "Pesquisador",
      descricao: "Quando não sabe uma informação, geralmente sabe onde ou com quem procurá-la.",
    },
  },
  {
    id: "soldado",
    nome: "Soldado",
    descricao: "Serviu numa força militar, aprendendo disciplina, tática e combate.",
    periciasConcedidas: ["atletismo", "intimidacao"],
    equipamento: "Símbolo de patente, troféu de um inimigo caído, roupas comuns, 10 po",
    caracteristica: {
      nome: "Posto Militar",
      descricao: "Você pode invocar seu posto pra conseguir acesso a acampamentos militares e apoio de outros soldados de sua nação.",
    },
  },
];

export function obterAntecedente(id) {
  return ANTECEDENTES.find((antecedente) => antecedente.id === id) ?? null;
}
