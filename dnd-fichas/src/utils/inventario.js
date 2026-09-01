export function criarItemVazio() {
  return {
    id: crypto.randomUUID(),
    nome: "",
    quantidade: 1,
    peso: 0,
  };
}
