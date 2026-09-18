// Regras PHB 2014 que não pertencem à lista normal da classe. Mantidas em
// dados para que catálogo, level up e validação consultem a mesma tabela.
export const SEGREDOS_MAGICOS = {
  bardo: [{ nivel: 10, quantidade: 2 }, { nivel: 14, quantidade: 2 }, { nivel: 18, quantidade: 2 }],
  "colegio-conhecimento": [{ nivel: 6, quantidade: 2 }],
};

export const REGRAS_TROCA_MAGIAS = {
  bardo: { emTodoNivel: true, quantidade: 1, tipos: ["conhecida", "segredo-magico"], mensagem: "Você pode substituir uma magia de Bardo conhecida." },
  bruxo: { emTodoNivel: true, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Bruxo conhecida." },
  feiticeiro: { emTodoNivel: true, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Feiticeiro conhecida." },
  patrulheiro: { emTodoNivel: true, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Patrulheiro conhecida." },
  "cavaleiro-arcano": { emTodoNivel: true, minimo: 3, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Mago do Cavaleiro Arcano." },
  "trapaceiro-arcano": { emTodoNivel: true, minimo: 3, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Mago do Trapaceiro Arcano." },
};

export function escolhasSegredosMagicos(classeId, subclasseId, nivel) {
  const regras = [...(SEGREDOS_MAGICOS[classeId] ?? []), ...(SEGREDOS_MAGICOS[subclasseId] ?? [])];
  return regras.filter((regra) => Number(nivel) >= regra.nivel).reduce((soma, regra) => soma + regra.quantidade, 0);
}

export function regraTrocaMagias(classeId, subclasseId, nivel) {
  const regra = REGRAS_TROCA_MAGIAS[subclasseId] ?? REGRAS_TROCA_MAGIAS[classeId];
  return regra && Number(nivel) >= (regra.minimo ?? 1) ? regra : null;
}
