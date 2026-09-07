export function criarRecursoVazio() {
  return {
    id: crypto.randomUUID(),
    nome: "",
    usosMax: 1,
    usosGastos: 0,
    restauraEm: "longo", // "curto" | "longo"
  };
}

// tipoDescanso: "curto" ou "longo" — o que a pessoa acabou de fazer.
// Num descanso longo, tudo restaura. Num descanso curto, só os recursos
// marcados como "restauraEm: curto".
export function restaurarRecursos(recursos, tipoDescanso) {
  return recursos.map((recurso) => {
    const restaura = tipoDescanso === "longo" || recurso.restauraEm === "curto";
    return restaura ? { ...recurso, usosGastos: 0 } : recurso;
  });
}