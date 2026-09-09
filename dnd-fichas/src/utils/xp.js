 // Trilha de XP: tabela oficial de experiência acumulada necessária para
// cada nível (Livro do Jogador, regra padrão). Índice 0 = nível 1.
// Usado só quando ficha.progressao.modo === "xp" — no modo "marco" a
// ficha não olha pra essa tabela, o mestre decide na mão.
export const LIMIAR_XP_POR_NIVEL = [
  0, 300, 900, 2700, 6500, 14000, 23000, 34000, 48000, 64000, 85000, 100000,
  120000, 140000, 165000, 195000, 225000, 265000, 305000, 355000,
];

export function nivelPorXp(xp) {
  let nivel = 1;
  for (let i = 0; i < LIMIAR_XP_POR_NIVEL.length; i += 1) {
    if (xp >= LIMIAR_XP_POR_NIVEL[i]) nivel = i + 1;
  }
  return nivel;
}

export function xpParaNivel(nivel) {
  const indice = Math.min(Math.max(nivel, 1), LIMIAR_XP_POR_NIVEL.length) - 1;
  return LIMIAR_XP_POR_NIVEL[indice];
}

export function xpParaProximoNivel(nivelAtual) {
  if (nivelAtual >= LIMIAR_XP_POR_NIVEL.length) return null;
  return LIMIAR_XP_POR_NIVEL[nivelAtual];
}

// Resumo pronto pra UI: quanto falta e quanto % da barra já foi preenchido
// entre o limiar do nível atual e o limiar do próximo.
export function progressoXp(xpAtual, nivelAtual) {
  const limiarAtual = xpParaNivel(nivelAtual);
  const limiarProximo = xpParaProximoNivel(nivelAtual);

  if (limiarProximo == null) {
    return { limiarAtual, limiarProximo: null, faltam: 0, percentual: 100 };
  }

  const faltam = Math.max(0, limiarProximo - xpAtual);
  const percentual = Math.min(
    100,
    Math.max(
      0,
      Math.round(((xpAtual - limiarAtual) / (limiarProximo - limiarAtual)) * 100)
    )
  );

  return { limiarAtual, limiarProximo, faltam, percentual };
}