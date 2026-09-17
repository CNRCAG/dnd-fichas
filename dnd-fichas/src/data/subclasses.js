// Duas subclasses conhecidas por classe, com a característica de
// assinatura (a que define a subclasse). Dá pra expandir com mais
// níveis de característica depois, do mesmo jeito que as outras bases.

export const NIVEL_ESCOLHA_SUBCLASSE = {
  barbaro: 3,
  bardo: 3,
  bruxo: 1,
  clerigo: 1,
  druida: 2,
  feiticeiro: 1,
  guerreiro: 3,
  ladino: 3,
  mago: 2,
  monge: 3,
  paladino: 3,
  patrulheiro: 3,
};

export const SUBCLASSES = [
  { id: "berserker", classeId: "barbaro", nome: "Trilha do Berserker", nivel: 3, descricao: "Entra num estado de fúria ainda mais intensa (Frenesi), causando dano extra mas sofrendo exaustão depois." },
  { id: "totem-guerreiro", classeId: "barbaro", nome: "Trilha do Totem Guerreiro", nivel: 3, descricao: "Escolhe um espírito totêmico (Urso, Águia ou Lobo) que concede um benefício passivo durante a fúria." },

  { id: "colegio-conhecimento", classeId: "bardo", nome: "Colégio do Conhecimento", nivel: 3, descricao: "Ganha proficiência em 3 perícias extras e pode usar Palavras de Corte pra atrapalhar rolagens de inimigos." },
  { id: "colegio-bravura", classeId: "bardo", nome: "Colégio da Bravura", nivel: 3, descricao: "Pode usar Inspiração de Bardo em si mesmo e ganha resistência extra em combate." },

  { id: "patrono-arquifada", classeId: "bruxo", nome: "Patrono: O Arquifada", nivel: 1, descricao: "Pacto com um senhor feérico; ganha a magia Passo Fey pra teleportar curtas distâncias." },
  { id: "patrono-corruptor", classeId: "bruxo", nome: "Patrono: O Corruptor", nivel: 1, descricao: "Pacto com um demônio; ganha PV temporário extra ao reduzir um inimigo a 0 PV." },

  { id: "dominio-vida", classeId: "clerigo", nome: "Domínio da Vida", nivel: 1, descricao: "Magias de cura ficam mais eficientes; ganha proficiência com armaduras pesadas." },
  { id: "dominio-luz", classeId: "clerigo", nome: "Domínio da Luz", nivel: 1, descricao: "Ganha truques extras de dano radiante/fogo e pode causar um clarão cegante nos inimigos." },

  { id: "circulo-terra", classeId: "druida", nome: "Círculo da Terra", nivel: 2, descricao: "Ganha magias extras de acordo com o terreno e pode recuperar espaços de magia uma vez por dia." },
  { id: "circulo-lua", classeId: "druida", nome: "Círculo da Lua", nivel: 2, descricao: "Pode se transformar em bestas mais poderosas em combate, usando Forma Selvagem como ação bônus." },

  { id: "linhagem-draconica", classeId: "feiticeiro", nome: "Linhagem Dracônica", nivel: 1, descricao: "Ascendência dracônica dá PV extra, resistência a um tipo de dano e melhora sua CA sem armadura." },
  { id: "magia-selvagem", classeId: "feiticeiro", nome: "Magia Selvagem", nivel: 1, descricao: "Ao conjurar magias, pode disparar um Surto Selvagem: um efeito mágico aleatório e imprevisível." },

  { id: "campeao", classeId: "guerreiro", nome: "Campeão", nivel: 3, descricao: "Aumenta a faixa de acerto crítico dos seus ataques com armas." },
  { id: "cavaleiro-arcano", classeId: "guerreiro", nome: "Cavaleiro Arcano", nivel: 3, descricao: "Guerreiro que combina combate e magias arcanas." },
  { id: "mestre-de-batalha", classeId: "guerreiro", nome: "Mestre de Batalha", nivel: 3, descricao: "Aprende manobras de combate especiais (Superioridade em Combate) usando dados de superioridade." },

  { id: "ladrao", classeId: "ladino", nome: "Ladrão", nivel: 3, descricao: "Fica mais ágil com objetos e escalada, e pode usar itens mágicos rapidamente como ação bônus." },
  { id: "trapaceiro-arcano", classeId: "ladino", nome: "Trapaceiro Arcano", nivel: 3, descricao: "Ladino que usa magias arcanas para enganar e se infiltrar." },
  { id: "assassino", classeId: "ladino", nome: "Assassino", nivel: 3, descricao: "Ataques contra alvos surpreendidos viram acerto automático e crítico." },

  { id: "escola-evocacao", classeId: "mago", nome: "Escola de Evocação", nivel: 2, descricao: "Pode moldar magias de área pra não atingir aliados, e causa dano extra com magias de evocação." },
  { id: "escola-abjuracao", classeId: "mago", nome: "Escola de Abjuração", nivel: 2, descricao: "Pode criar um Escudo Arcano que absorve dano ao conjurar magias de abjuração." },

  { id: "mao-aberta", classeId: "monge", nome: "Caminho da Mão Aberta", nivel: 3, descricao: "Golpes com Rajada de Golpes podem derrubar, empurrar ou atordoar o alvo." },
  { id: "sombra", classeId: "monge", nome: "Caminho da Sombra", nivel: 3, descricao: "Aprende truques de magia sombria: teleportar entre sombras e criar escuridão." },

  { id: "juramento-devocao", classeId: "paladino", nome: "Juramento da Devoção", nivel: 3, descricao: "Focado em honra e proteção; ganha magias sagradas extras e pode punir inimigos com mais força." },
  { id: "juramento-vinganca", classeId: "paladino", nome: "Juramento da Vingança", nivel: 3, descricao: "Focado em perseguir e abater um alvo específico, com vantagem em ataques contra ele." },

  { id: "cacador", classeId: "patrulheiro", nome: "Caçador", nivel: 3, descricao: "Ganha talentos de combate especializados contra tipos específicos de ameaça." },
  { id: "mestre-das-feras", classeId: "patrulheiro", nome: "Mestre das Feras", nivel: 3, descricao: "Ganha um companheiro animal que luta ao seu lado, comandado como ação bônus." },
];

export function obterSubclassesPorClasse(classeId) {
  return SUBCLASSES.filter((s) => s.classeId === classeId);
}

export function obterSubclasse(id) {
  return SUBCLASSES.find((s) => s.id === id) ?? null;
}

export function obterNivelEscolhaSubclasse(classeId) {
  return NIVEL_ESCOLHA_SUBCLASSE[classeId] ?? null;
}