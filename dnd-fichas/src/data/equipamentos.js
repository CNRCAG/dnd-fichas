// Itens de equipamento geral e ferramentas do manual básico (PHB/SRD).
// "descricao" é uma nota curta, opcional, sobre o uso do item.

export const EQUIPAMENTOS_GERAIS = [
  { id: "mochila", nome: "Mochila", peso: 2.5, custo: 2 },
  { id: "barraca", nome: "Barraca (2 pessoas)", peso: 10, custo: 2 },
  { id: "corda-canhamo", nome: "Corda de cânhamo (15m)", peso: 5, custo: 1 },
  { id: "corda-seda", nome: "Corda de seda (15m)", peso: 2.5, custo: 10 },
  { id: "odre", nome: "Odre d'água", peso: 2.5, custo: 0.2 },
  { id: "frasco-oleo", nome: "Frasco de óleo", peso: 0.5, custo: 0.1 },
  { id: "tocha", nome: "Tocha", peso: 0.5, custo: 0.01 },
  { id: "lanterna-capuz", nome: "Lanterna de capuz", peso: 1, custo: 5 },
  { id: "vela", nome: "Vela", peso: 0, custo: 0.01 },
  { id: "isqueiro", nome: "Isqueiro", peso: 0, custo: 0.5 },
  { id: "kit-curandeiro", nome: "Kit de curandeiro", peso: 1.5, custo: 5, descricao: "10 usos, estabiliza um alvo a 0 PV" },
  { id: "saco-de-dormir", nome: "Saco de dormir", peso: 3.5, custo: 0.1 },
  { id: "sacola", nome: "Sacola", peso: 0.25, custo: 0.01 },
  { id: "pe-de-cabra", nome: "Pé-de-cabra", peso: 2.5, custo: 2, descricao: "Vantagem em testes de FOR para forçar algo" },
  { id: "martelo", nome: "Martelo", peso: 1, custo: 1 },
  { id: "estacas-tenda", nome: "Estacas de tenda (x10)", peso: 2.5, custo: 0.05 },
  { id: "corrente", nome: "Corrente (3m)", peso: 5, custo: 5 },
  { id: "cadeado", nome: "Cadeado", peso: 0.5, custo: 10 },
  { id: "papel", nome: "Papel (folha)", peso: 0, custo: 0.2 },
  { id: "pergaminho", nome: "Pergaminho (folha)", peso: 0, custo: 0.1 },
  { id: "tinta-pena", nome: "Frasco de tinta + pena", peso: 0, custo: 10 },
  { id: "livro", nome: "Livro", peso: 2.5, custo: 25 },
  { id: "kit-costura", nome: "Kit de costura", peso: 0.5, custo: 0.25 },
  { id: "sabao", nome: "Sabão", peso: 0, custo: 0.02 },
  { id: "espelho-aco", nome: "Espelho de aço", peso: 0.25, custo: 5 },
  { id: "perfume", nome: "Frasco de perfume", peso: 0, custo: 5 },
  { id: "racao", nome: "Ração de viagem (1 dia)", peso: 1, custo: 0.5 },
  { id: "mapa-ou-pergaminho-de-caso", nome: "Estojo para mapas/pergaminhos", peso: 0.5, custo: 1 },
  { id: "lampiao", nome: "Lampião", peso: 1, custo: 5 },
  { id: "poção-de-cura", nome: "Poção de cura", peso: 0.25, custo: 50, descricao: "Recupera 2d4+2 PV ao beber" },
];

export const FERRAMENTAS = [
  { id: "ferramentas-ladino", nome: "Ferramentas de ladino", peso: 0.5, custo: 25 },
  { id: "ferramentas-disfarce", nome: "Kit de disfarce", peso: 1.5, custo: 25 },
  { id: "ferramentas-falsificacao", nome: "Kit de falsificação", peso: 2.5, custo: 15 },
  { id: "kit-alquimista", nome: "Ferramentas de alquimista", peso: 4, custo: 50 },
  { id: "kit-ervanario", nome: "Kit de herbalismo", peso: 1.5, custo: 5 },
  { id: "ferramentas-ferreiro", nome: "Ferramentas de ferreiro", peso: 4, custo: 20 },
  { id: "ferramentas-carpinteiro", nome: "Ferramentas de carpinteiro", peso: 3, custo: 8 },
  { id: "instrumento-musical", nome: "Instrumento musical (qualquer)", peso: 1.5, custo: 5 },
  { id: "jogo-de-dados", nome: "Jogo de dados", peso: 0, custo: 0.1 },
  { id: "baralho-cartas", nome: "Baralho de cartas", peso: 0, custo: 0.5 },
];

export const EQUIPAMENTOS = [...EQUIPAMENTOS_GERAIS, ...FERRAMENTAS];

export function obterEquipamento(id) {
  return EQUIPAMENTOS.find((item) => item.id === id) ?? null;
}
