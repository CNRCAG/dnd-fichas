export const TIPOS_MOEDA = ["cobre", "prata", "electro", "ouro", "platina"];

function quantidadeMoeda(valor) {
  return Math.max(0, Math.floor(Number.isFinite(Number(valor)) ? Number(valor) : 0));
}

export function normalizarMoedas(moedas) {
  return Object.fromEntries(
    TIPOS_MOEDA.map((chave) => [chave, quantidadeMoeda(moedas?.[chave])])
  );
}

export function atualizarMoeda(moedas, chave, valor) {
  if (!TIPOS_MOEDA.includes(chave)) return normalizarMoedas(moedas);
  return {
    ...normalizarMoedas(moedas),
    [chave]: quantidadeMoeda(valor),
  };
}

export function valorTotalEmCobre(moedas) {
  const valores = normalizarMoedas(moedas);
  return valores.cobre
    + valores.prata * 10
    + valores.electro * 50
    + valores.ouro * 100
    + valores.platina * 1000;
}
