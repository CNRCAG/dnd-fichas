export const MULTIPLICADOR_CAPACIDADE_CARGA = 15;

export function calcularCapacidadeCarga(forcaTotal) {
  const forca = Number(forcaTotal);
  if (!Number.isFinite(forca) || forca <= 0) return 0;
  return forca * MULTIPLICADOR_CAPACIDADE_CARGA;
}

export function calcularPesoInventario(inventario) {
  return (inventario ?? []).reduce((total, item) => {
    const quantidade = Math.max(0, Number(item?.quantidade) || 0);
    const peso = Math.max(0, Number(item?.peso) || 0);
    return total + quantidade * peso;
  }, 0);
}
