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
  };
}
