// Armaduras do manual básico (PHB/SRD). "ca" descreve a fórmula da Classe
// de Armadura em texto (pra exibição); "caBase" e "caModDes" descrevem a
// mesma fórmula de forma numérica, pra dar pra calcular automaticamente
// quando a peça está equipada. "forcaMinima" e "desvantagemFurtividade"
// seguem a regra oficial de cada peça.
//
// caModDes: "total" (soma o mod. DES inteiro), "max2" (soma até +2),
// "none" (não soma DES), "bonus" (é um bônus adicional, caso do escudo).

export const ARMADURAS_LEVES = [
  { id: "acolchoada", nome: "Acolchoada", tipo: "leve", ca: "11 + mod. DES", caBase: 11, caModDes: "total", forcaMinima: null, desvantagemFurtividade: true, peso: 4, custo: 5 },
  { id: "couro", nome: "Couro", tipo: "leve", ca: "11 + mod. DES", caBase: 11, caModDes: "total", forcaMinima: null, desvantagemFurtividade: false, peso: 5, custo: 10 },
  { id: "couro-batido", nome: "Couro batido", tipo: "leve", ca: "12 + mod. DES", caBase: 12, caModDes: "total", forcaMinima: null, desvantagemFurtividade: false, peso: 6, custo: 45 },
];

export const ARMADURAS_MEDIAS = [
  { id: "peles", nome: "Peles", tipo: "media", ca: "12 + mod. DES (máx. 2)", caBase: 12, caModDes: "max2", forcaMinima: null, desvantagemFurtividade: false, peso: 6, custo: 10 },
  { id: "cota-de-malha-curta", nome: "Cota de malha curta", tipo: "media", ca: "13 + mod. DES (máx. 2)", caBase: 13, caModDes: "max2", forcaMinima: null, desvantagemFurtividade: false, peso: 10, custo: 50 },
  { id: "armadura-de-escamas", nome: "Armadura de escamas", tipo: "media", ca: "14 + mod. DES (máx. 2)", caBase: 14, caModDes: "max2", forcaMinima: null, desvantagemFurtividade: true, peso: 22.5, custo: 50 },
  { id: "peitoral", nome: "Peitoral", tipo: "media", ca: "14 + mod. DES (máx. 2)", caBase: 14, caModDes: "max2", forcaMinima: null, desvantagemFurtividade: false, peso: 10, custo: 400 },
  { id: "meia-armadura", nome: "Meia-armadura", tipo: "media", ca: "15 + mod. DES (máx. 2)", caBase: 15, caModDes: "max2", forcaMinima: null, desvantagemFurtividade: true, peso: 20, custo: 750 },
];

export const ARMADURAS_PESADAS = [
  { id: "cota-de-aneis", nome: "Cota de anéis", tipo: "pesada", ca: "14", caBase: 14, caModDes: "none", forcaMinima: null, desvantagemFurtividade: true, peso: 20, custo: 30 },
  { id: "cota-de-malha", nome: "Cota de malha", tipo: "pesada", ca: "16", caBase: 16, caModDes: "none", forcaMinima: 13, desvantagemFurtividade: true, peso: 27.5, custo: 75 },
  { id: "brunea-lamelar", nome: "Brunea lamelar (Splint)", tipo: "pesada", ca: "17", caBase: 17, caModDes: "none", forcaMinima: 15, desvantagemFurtividade: true, peso: 30, custo: 200 },
  { id: "armadura-de-placas", nome: "Armadura de placas", tipo: "pesada", ca: "18", caBase: 18, caModDes: "none", forcaMinima: 15, desvantagemFurtividade: true, peso: 32.5, custo: 1500 },
];

export const ESCUDOS = [
  { id: "escudo", nome: "Escudo", tipo: "escudo", ca: "+2", caBase: 2, caModDes: "bonus", forcaMinima: null, desvantagemFurtividade: false, peso: 3, custo: 10 },
];

export const ARMADURAS = [
  ...ARMADURAS_LEVES,
  ...ARMADURAS_MEDIAS,
  ...ARMADURAS_PESADAS,
  ...ESCUDOS,
];

export function obterArmadura(id) {
  return ARMADURAS.find((armadura) => armadura.id === id) ?? null;
}
