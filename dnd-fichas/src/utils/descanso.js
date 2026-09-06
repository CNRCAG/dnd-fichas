// Ajuda o descanso curto/longo: restaurar espaços de magia e calcular
// quantos dados de vida o personagem recupera num descanso longo.

export function restaurarTodosEspacos(espacosMagia) {
  const resultado = {};
  for (const [nivel, espaco] of Object.entries(espacosMagia)) {
    resultado[nivel] = { ...espaco, usados: 0 };
  }
  return resultado;
}

export function calcularDadosDeVidaRecuperados(nivelPersonagem) {
  return Math.max(1, Math.floor(nivelPersonagem / 2));
}