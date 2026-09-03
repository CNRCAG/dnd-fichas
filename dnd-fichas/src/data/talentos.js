// Talentos do 5e (PHB) — resumos escritos com nossas próprias palavras.
// Uma seleção dos mais populares/conhecidos, não a lista completa do livro.

export const TALENTOS = [
  { id: "alerta", nome: "Alerta", descricao: "Sempre ganha +5 na iniciativa, não pode ser surpreendido enquanto consciente e criaturas escondidas não ganham vantagem contra você por isso." },
  { id: "atleta", nome: "Atleta", descricao: "Melhora Força ou Destreza em 1; facilita levantar-se, escalar e saltos com corrida curta." },
  { id: "perito-besta-mao", nome: "Perito em Besta de Mão", descricao: "Remove a desvantagem de atirar em alvo próximo com bestas, e permite atacar corpo a corpo com ação bônus após atirar." },
  { id: "duelista-defensivo", nome: "Duelista Defensivo", descricao: "Com uma arma leve em mãos, pode usar a reação pra somar seu bônus de proficiência à CA contra um ataque corpo a corpo." },
  { id: "combatente-duas-armas", nome: "Combatente com Duas Armas", descricao: "Soma o modificador de habilidade no dano do ataque bônus com a segunda arma, e ganha outros benefícios lutando com duas armas." },
  { id: "resistente", nome: "Resistente", descricao: "Melhora Constituição em 1 e ganha proficiência em salvaguardas de Constituição, se ainda não tiver." },
  { id: "adepto-elemental", nome: "Adepto Elemental", descricao: "Magias de um tipo de dano escolhido ignoram resistência a esse dano, e dados de dano mínimo 1 nesse tipo." },
  { id: "mestre-armas-grandes", nome: "Mestre das Armas Grandes", descricao: "Pode trocar -5 no ataque por +10 no dano com armas pesadas; ganha ataque bônus ao derrubar um inimigo." },
  { id: "curandeiro", nome: "Curandeiro", descricao: "Usando um kit de curandeiro, estabiliza um moribundo e ainda recupera pontos de vida dele; cura extra ao longo do dia." },
  { id: "mestre-armadura-pesada", nome: "Mestre da Armadura Pesada", descricao: "Com proficiência em armadura pesada, reduz em 3 o dano de ataques cortantes, perfurantes e concussão não mágicos." },
  { id: "lider-inspirador", nome: "Líder Inspirador", descricao: "Gasta 10 minutos motivando aliados, que ganham pontos de vida temporários." },
  { id: "mente-afiada", nome: "Mente Afiada", descricao: "Melhora Inteligência em 1; ganha proficiência numa perícia de Inteligência e sabe a hora do dia sem relógio." },
  { id: "sortudo", nome: "Sortudo", descricao: "Ganha pontos de sorte pra rerrolar dados de ataque, teste ou resistência, seus ou de um inimigo contra você." },
  { id: "iniciado-magia", nome: "Iniciado em Magia", descricao: "Aprende dois truques e uma magia de nível 1 de uma classe conjuradora à escolha." },
  { id: "adepto-marcial", nome: "Adepto Marcial", descricao: "Aprende duas manobras de combate e ganha um dado de superioridade pra usá-las." },
  { id: "movel", nome: "Móvel", descricao: "Deslocamento aumenta em 3m; ignora terreno difícil ao Disparar; não sofre ataque de oportunidade de quem já atacou." },
  { id: "combatente-montado", nome: "Combatente Montado", descricao: "Ganha vantagem em ataques contra criaturas menores que sua montaria e pode redirecionar ataques pra si mesmo." },
  { id: "observador", nome: "Observador", descricao: "Melhora Inteligência ou Sabedoria em 1; ganha bônus passivo em Percepção e Investigação, e lê lábios." },
  { id: "mestre-arma-haste", nome: "Mestre de Arma de Haste", descricao: "Com armas de alcance como lança ou alabarda, ganha ataque de oportunidade quando um inimigo entra no seu alcance." },
  { id: "atacante-selvagem", nome: "Atacante Selvagem", descricao: "Rola o dado de dano corpo a corpo duas vezes e usa o maior resultado." },
  { id: "sentinela", nome: "Sentinela", descricao: "Ataques de oportunidade reduzem o deslocamento do alvo a 0, e você pode reagir mesmo se o alvo usar Disparada." },
  { id: "habilidoso", nome: "Habilidoso", descricao: "Ganha proficiência em três perícias ou ferramentas à sua escolha." },
  { id: "mestre-escudo", nome: "Mestre do Escudo", descricao: "Com escudo em mãos, pode empurrar um inimigo como ação bônus e ganha bônus na resistência contra alguns efeitos." },
  { id: "atirador-certeiro", nome: "Atirador Certeiro", descricao: "Ignora cobertura parcial e desvantagem por longo alcance; pode trocar -5 no ataque à distância por +10 no dano." },
  { id: "brigao-taverna", nome: "Brigão de Taverna", descricao: "Melhora Força ou Constituição em 1; dano desarmado maior e pode agarrar como ataque bônus após um acerto desarmado." },
  { id: "robusto", nome: "Robusto", descricao: "Ganha pontos de vida máximos extras a cada nível." },
  { id: "conjurador-guerra", nome: "Conjurador de Guerra", descricao: "Vantagem em salvaguardas de Constituição pra manter concentração e pode conjurar magias com as mãos ocupadas." },
];

export function obterTalento(id) {
  return TALENTOS.find((talento) => talento.id === id) ?? null;
}
