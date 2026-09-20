// Regras PHB 2014 que não pertencem à lista normal da classe. Mantidas em
// dados para que catálogo, level up e validação consultem a mesma tabela.
export const SEGREDOS_MAGICOS = {
  bardo: [{ nivel: 10, quantidade: 2 }, { nivel: 14, quantidade: 2 }, { nivel: 18, quantidade: 2 }],
  "colegio-conhecimento": [{ nivel: 6, quantidade: 2, adicional: true }],
};

export const REGRAS_TROCA_MAGIAS = {
  bardo: { emTodoNivel: true, quantidade: 1, tipos: ["conhecida", "segredo-magico"], mensagem: "Você pode substituir uma magia de Bardo conhecida." },
  bruxo: { emTodoNivel: true, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Bruxo conhecida." },
  feiticeiro: { emTodoNivel: true, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Feiticeiro conhecida." },
  patrulheiro: { emTodoNivel: true, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Patrulheiro conhecida." },
  "cavaleiro-arcano": { emTodoNivel: true, minimo: 3, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Mago do Cavaleiro Arcano." },
  "trapaceiro-arcano": { emTodoNivel: true, minimo: 3, quantidade: 1, tipos: ["conhecida"], mensagem: "Você pode substituir uma magia de Mago do Trapaceiro Arcano." },
};

export function resolverRegraTrocaMagias(regra, nivel) {
  if (!regra || !Number.isInteger(Number(nivel)) || Number(nivel) < (regra.minimo ?? 1)) {
    return null;
  }

  const chaveNivel = String(Number(nivel));
  let quantidade = 0;
  if (Object.prototype.hasOwnProperty.call(regra.quantidadePorNivel ?? {}, chaveNivel)) {
    quantidade = Number(regra.quantidadePorNivel[chaveNivel]) || 0;
  } else if (Array.isArray(regra.niveis)) {
    quantidade = regra.niveis.includes(Number(nivel)) ? Number(regra.quantidade ?? 1) : 0;
  } else if (regra.emTodoNivel) {
    quantidade = Number(regra.quantidade ?? 1);
  }

  return quantidade > 0
    ? { ...regra, quantidade: Math.max(0, Math.floor(quantidade)) }
    : null;
}

export function escolhasSegredosMagicos(classeId, subclasseId, nivel) {
  const regras = [...(SEGREDOS_MAGICOS[classeId] ?? []), ...(SEGREDOS_MAGICOS[subclasseId] ?? [])];
  return regras.filter((regra) => Number(nivel) >= regra.nivel).reduce((soma, regra) => soma + regra.quantidade, 0);
}

export function escolhasSegredosMagicosAdicionais(subclasseId, nivel) {
  return (SEGREDOS_MAGICOS[subclasseId] ?? [])
    .filter((regra) => regra.adicional && Number(nivel) >= regra.nivel)
    .reduce((soma, regra) => soma + regra.quantidade, 0);
}

export function regraTrocaMagias(classeId, subclasseId, nivel, regras = REGRAS_TROCA_MAGIAS) {
  const regra = regras[subclasseId] ?? regras[classeId];
  return resolverRegraTrocaMagias(regra, nivel);
}
