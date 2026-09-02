// Armas do manual básico (PHB/SRD). Alcance em metros (curto/longo) para
// armas à distância ou arremessáveis; peso em kg; custo em peças de ouro.

export const ARMAS_SIMPLES_CORPO_A_CORPO = [
  { id: "clava", nome: "Clava", dano: "1d4", tipoDano: "concussão", propriedades: ["leve"], peso: 1, custo: 0.1 },
  { id: "adaga", nome: "Adaga", dano: "1d4", tipoDano: "perfurante", propriedades: ["acuidade", "leve", "arremessável (6/18m)"], peso: 0.5, custo: 2 },
  { id: "machado-grande-simples", nome: "Machado grande", dano: "1d10", tipoDano: "cortante", propriedades: ["pesada", "duas mãos"], peso: 4, custo: 20 },
  { id: "machadinha", nome: "Machadinha", dano: "1d6", tipoDano: "cortante", propriedades: ["leve", "arremessável (6/18m)"], peso: 1, custo: 5 },
  { id: "azagaia", nome: "Azagaia", dano: "1d6", tipoDano: "perfurante", propriedades: ["arremessável (9/36m)"], peso: 1, custo: 0.5 },
  { id: "martelo-leve", nome: "Martelo leve", dano: "1d4", tipoDano: "concussão", propriedades: ["leve", "arremessável (6/18m)"], peso: 1, custo: 2 },
  { id: "maca", nome: "Maça", dano: "1d6", tipoDano: "concussão", propriedades: [], peso: 2, custo: 5 },
  { id: "bordao", nome: "Bordão", dano: "1d6", tipoDano: "concussão", propriedades: ["versátil (1d8)"], peso: 2, custo: 0.2 },
  { id: "foice", nome: "Foice", dano: "1d4", tipoDano: "cortante", propriedades: ["leve"], peso: 1, custo: 1 },
  { id: "lanca", nome: "Lança", dano: "1d6", tipoDano: "perfurante", propriedades: ["versátil (1d8)", "arremessável (6/18m)"], peso: 1.5, custo: 1 },
];

export const ARMAS_SIMPLES_DISTANCIA = [
  { id: "besta-leve", nome: "Besta leve", dano: "1d8", tipoDano: "perfurante", propriedades: ["munição (24/96m)", "duas mãos", "carregar"], peso: 2.5, custo: 25 },
  { id: "dardo", nome: "Dardo", dano: "1d4", tipoDano: "perfurante", propriedades: ["acuidade", "arremessável (6/18m)"], peso: 0.125, custo: 0.05 },
  { id: "arco-curto", nome: "Arco curto", dano: "1d6", tipoDano: "perfurante", propriedades: ["munição (24/96m)", "duas mãos"], peso: 1, custo: 25 },
  { id: "funda", nome: "Funda", dano: "1d4", tipoDano: "concussão", propriedades: ["munição (9/36m)"], peso: 0, custo: 0.1 },
];

export const ARMAS_MARCIAIS_CORPO_A_CORPO = [
  { id: "machado-de-batalha", nome: "Machado de batalha", dano: "1d8", tipoDano: "cortante", propriedades: ["versátil (1d10)"], peso: 2, custo: 10 },
  { id: "mangual", nome: "Mangual", dano: "1d8", tipoDano: "concussão", propriedades: [], peso: 1, custo: 10 },
  { id: "vergalho", nome: "Vergalho (Glaive)", dano: "1d10", tipoDano: "cortante", propriedades: ["pesada", "alcance", "duas mãos"], peso: 3, custo: 20 },
  { id: "machado-grande", nome: "Machado grande", dano: "1d12", tipoDano: "cortante", propriedades: ["pesada", "duas mãos"], peso: 3.5, custo: 30 },
  { id: "espada-grande", nome: "Espada grande", dano: "2d6", tipoDano: "cortante", propriedades: ["pesada", "duas mãos"], peso: 3, custo: 50 },
  { id: "alabarda", nome: "Alabarda", dano: "1d10", tipoDano: "cortante", propriedades: ["pesada", "alcance", "duas mãos"], peso: 3, custo: 20 },
  { id: "lanca-de-cavalaria", nome: "Lança de cavalaria", dano: "1d12", tipoDano: "perfurante", propriedades: ["alcance", "especial"], peso: 3, custo: 10 },
  { id: "espada-longa", nome: "Espada longa", dano: "1d8", tipoDano: "cortante", propriedades: ["versátil (1d10)"], peso: 1.5, custo: 15 },
  { id: "malho", nome: "Malho (Maul)", dano: "2d6", tipoDano: "concussão", propriedades: ["pesada", "duas mãos"], peso: 5, custo: 10 },
  { id: "montante", nome: "Montante (Morningstar)", dano: "1d8", tipoDano: "perfurante", propriedades: [], peso: 2, custo: 15 },
  { id: "pique", nome: "Pique", dano: "1d10", tipoDano: "perfurante", propriedades: ["pesada", "alcance", "duas mãos"], peso: 9, custo: 5 },
  { id: "rapieira", nome: "Rapieira", dano: "1d8", tipoDano: "perfurante", propriedades: ["acuidade"], peso: 1, custo: 25 },
  { id: "cimitarra", nome: "Cimitarra", dano: "1d6", tipoDano: "cortante", propriedades: ["acuidade", "leve"], peso: 1.5, custo: 25 },
  { id: "espada-curta", nome: "Espada curta", dano: "1d6", tipoDano: "perfurante", propriedades: ["acuidade", "leve"], peso: 1, custo: 10 },
  { id: "tridente", nome: "Tridente", dano: "1d6", tipoDano: "perfurante", propriedades: ["versátil (1d8)", "arremessável (6/18m)"], peso: 2, custo: 5 },
  { id: "picareta-de-guerra", nome: "Picareta de guerra", dano: "1d8", tipoDano: "perfurante", propriedades: ["pesada"], peso: 1, custo: 5 },
  { id: "martelo-de-guerra", nome: "Martelo de guerra", dano: "1d8", tipoDano: "concussão", propriedades: ["versátil (1d10)"], peso: 1, custo: 15 },
  { id: "chicote", nome: "Chicote", dano: "1d4", tipoDano: "cortante", propriedades: ["acuidade", "alcance"], peso: 1.5, custo: 2 },
];

export const ARMAS_MARCIAIS_DISTANCIA = [
  { id: "zarabatana", nome: "Zarabatana", dano: "1", tipoDano: "perfurante", propriedades: ["munição (7,5/30m)", "carregar"], peso: 0.5, custo: 10 },
  { id: "besta-de-mao", nome: "Besta de mão", dano: "1d6", tipoDano: "perfurante", propriedades: ["leve", "munição (9/36m)", "carregar"], peso: 1.5, custo: 75 },
  { id: "besta-pesada", nome: "Besta pesada", dano: "1d10", tipoDano: "perfurante", propriedades: ["munição (30/120m)", "pesada", "duas mãos", "carregar"], peso: 9, custo: 50 },
  { id: "arco-longo", nome: "Arco longo", dano: "1d8", tipoDano: "perfurante", propriedades: ["munição (45/180m)", "pesada", "duas mãos"], peso: 1, custo: 50 },
  { id: "rede", nome: "Rede", dano: "—", tipoDano: null, propriedades: ["especial", "arremessável (2,5/4,5m)"], peso: 1.5, custo: 1 },
];

export const ARMAS = [
  ...ARMAS_SIMPLES_CORPO_A_CORPO.map((a) => ({ ...a, categoria: "simples", tipo: "corpoACorpo" })),
  ...ARMAS_SIMPLES_DISTANCIA.map((a) => ({ ...a, categoria: "simples", tipo: "distancia" })),
  ...ARMAS_MARCIAIS_CORPO_A_CORPO.map((a) => ({ ...a, categoria: "marcial", tipo: "corpoACorpo" })),
  ...ARMAS_MARCIAIS_DISTANCIA.map((a) => ({ ...a, categoria: "marcial", tipo: "distancia" })),
];

export function obterArma(id) {
  return ARMAS.find((arma) => arma.id === id) ?? null;
}
