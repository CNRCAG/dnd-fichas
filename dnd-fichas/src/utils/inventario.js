export function criarItemVazio() {
  return {
    id: crypto.randomUUID(),
    nome: "",
    quantidade: 1,
    peso: 0,
    tipoItem: "personalizado",
    origemId: null,
    equipado: false,
    magico: false,
    raridade: null, // "comum" | "incomum" | "raro" | "muitoRaro" | "lendario" | "artefato"
    bonusMagico: 0, // pra arma: soma no acerto e no dano; pra armadura: soma na CA
    requerEquipado: false,
    requerSintonizacao: false,
    sintonizado: false,
    efeitos: [],
    regras: [],
  };
}

export function criarItemDoCatalogo(itemCatalogo) {
  const itemMagico = itemCatalogo.grupo === "Itens mágicos" ? itemCatalogo.original : null;
  const cargas = itemMagico?.cargas;
  return {
    id: crypto.randomUUID(),
    nome: itemCatalogo.nome,
    quantidade: 1,
    peso: itemCatalogo.peso,
    tipoItem: itemCatalogo.tipoItem,
    origemId: itemMagico?.itemBaseId ?? itemCatalogo.id,
    itemMagicoId: itemMagico?.id ?? null,
    equipado: false,
    atributoAtaque: "auto",
    magico: Boolean(itemMagico),
    raridade: itemMagico?.raridade ?? null,
    bonusMagico: itemMagico?.bonusMagico ?? 0,
    requerEquipado: Boolean(itemMagico?.requerEquipado),
    requerSintonizacao: Boolean(itemMagico?.requerSintonizacao),
    sintonizado: false,
    efeitos: structuredClone(itemMagico?.efeitos ?? []),
    regras: [...(itemMagico?.regras ?? [])],
    cargasMaximas: cargas?.maximo ?? null,
    cargasAtuais: cargas?.inicial ?? null,
    custoCargaPadrao: cargas?.custoPadrao ?? null,
    recargaCargas: itemMagico?.recarga ? { ...itemMagico.recarga } : null,
  };
}
