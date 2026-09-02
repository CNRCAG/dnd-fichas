export function criarHabilidadeVazia() {
  return {
    id: crypto.randomUUID(),
    nome: "",
    tipo: "personalizada",
    nivel: null,
    origemId: null,
    descricao: "",
  };
}
