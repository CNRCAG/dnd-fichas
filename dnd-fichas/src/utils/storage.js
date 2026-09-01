const CHAVE_ARMAZENAMENTO = "pilares-de-atlas:fichas";

export function carregarFichas() {
  try {
    const bruto = localStorage.getItem(CHAVE_ARMAZENAMENTO);
    if (!bruto) return null;
    return JSON.parse(bruto);
  } catch {
    // localStorage indisponível (modo privado, etc.) ou JSON corrompido —
    // segue sem persistência em vez de quebrar a aplicação.
    return null;
  }
}

export function salvarFichas(fichas) {
  try {
    localStorage.setItem(CHAVE_ARMAZENAMENTO, JSON.stringify(fichas));
  } catch {
    // Sem espaço ou sem acesso ao localStorage — ignora silenciosamente.
  }
}
