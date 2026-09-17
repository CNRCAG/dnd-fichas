// Tabelas de truques e magias conhecidas do Basic Rules 2014.
// Índice 0 corresponde ao nível 1 da classe.
export const LIMITES_MAGIAS = {
  bardo: {
    truques: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    conhecidas: [4, 5, 6, 7, 8, 9, 10, 11, 12, 14, 15, 15, 16, 18, 19, 19, 20, 22, 22, 22],
  },
  clerigo: {
    truques: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  druida: {
    truques: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
  },
  patrulheiro: {
    truques: [0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0, 0],
  },
  feiticeiro: {
    truques: [4, 4, 4, 5, 5, 5, 5, 5, 5, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6, 6],
    conhecidas: [2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 12, 13, 13, 14, 14, 15, 15, 15, 15],
  },
  bruxo: {
    truques: [2, 2, 2, 3, 3, 3, 3, 3, 3, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4, 4],
    conhecidas: [2, 3, 4, 5, 6, 7, 8, 9, 10, 10, 11, 11, 12, 12, 13, 13, 14, 14, 15, 15],
  },
  mago: {
    truques: [3, 3, 3, 4, 4, 4, 4, 4, 4, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5, 5],
  },
  paladino: { truques: Array(20).fill(0) },
};

export function limitesMagiasDaClasse(classeId, nivel, atributos) {
  const indice = Math.max(0, Math.min(19, Number(nivel) - 1));
  const tabela = LIMITES_MAGIAS[classeId];
  if (!tabela || !Number.isInteger(Number(nivel)) || Number(nivel) < 1) return null;
  const modificador = (atributo) => Math.floor((Number(atributos?.[atributo] ?? 10) - 10) / 2);
  let preparadas = null;
  if (classeId === "clerigo" || classeId === "druida") preparadas = Math.max(1, Number(nivel) + modificador("sabedoria"));
  if (classeId === "mago") preparadas = Math.max(1, Number(nivel) + modificador("inteligencia"));
  if (classeId === "paladino" && Number(nivel) >= 2) preparadas = Math.max(1, Math.floor(Number(nivel) / 2) + modificador("carisma"));
  return { truques: tabela.truques[indice], conhecidas: tabela.conhecidas?.[indice] ?? null, preparadas };
}
