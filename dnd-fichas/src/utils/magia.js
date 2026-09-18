export function criarMagiaVazia() {
  return {
    id: crypto.randomUUID(),
    nome: "",
    nivel: 1,
    preparada: false,
    origemEspecial: null,
    fonteEspecial: "",
  };
}

export function criarEspacosMagiaVazios() {
  const espacos = {};
  for (let nivel = 1; nivel <= 9; nivel += 1) {
    espacos[nivel] = { total: 0, usados: 0 };
  }
  return espacos;
}
