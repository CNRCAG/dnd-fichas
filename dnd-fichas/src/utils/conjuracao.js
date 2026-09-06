// Progressão de espaços de magia do 5e. Classificamos cada classe como
// conjurador completo, de metade, de pacto (Bruxo) ou não-conjurador, e
// usamos a tabela oficial correspondente pra preencher os espaços
// automaticamente quando o nível muda.
//
// OBS: não modelamos subclasses com conjuração parcial (ex: Guerreiro
// Cavaleiro Arcano), só a conjuração base de cada classe.

export const TIPO_CONJURADOR = {
  bardo: "completo",
  clerigo: "completo",
  druida: "completo",
  feiticeiro: "completo",
  mago: "completo",
  paladino: "metade",
  patrulheiro: "metade",
  bruxo: "pacto",
};

// Índice = nível (1-20). Cada linha tem os espaços de nível 1 a 9.
const TABELA_COMPLETA = [
  null,
  [2, 0, 0, 0, 0, 0, 0, 0, 0],
  [3, 0, 0, 0, 0, 0, 0, 0, 0],
  [4, 2, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 0, 0, 0, 0, 0, 0, 0],
  [4, 3, 2, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 0, 0, 0, 0, 0, 0],
  [4, 3, 3, 1, 0, 0, 0, 0, 0],
  [4, 3, 3, 2, 0, 0, 0, 0, 0],
  [4, 3, 3, 3, 1, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 0, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 0, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 0, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 0],
  [4, 3, 3, 3, 2, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 1, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 1, 1, 1],
  [4, 3, 3, 3, 3, 2, 2, 1, 1],
];

const TABELA_METADE = [
  null,
  [0, 0, 0, 0, 0],
  [2, 0, 0, 0, 0],
  [3, 0, 0, 0, 0],
  [3, 0, 0, 0, 0],
  [4, 2, 0, 0, 0],
  [4, 2, 0, 0, 0],
  [4, 3, 0, 0, 0],
  [4, 3, 0, 0, 0],
  [4, 3, 2, 0, 0],
  [4, 3, 2, 0, 0],
  [4, 3, 3, 0, 0],
  [4, 3, 3, 0, 0],
  [4, 3, 3, 1, 0],
  [4, 3, 3, 1, 0],
  [4, 3, 3, 2, 0],
  [4, 3, 3, 2, 0],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 1],
  [4, 3, 3, 3, 2],
  [4, 3, 3, 3, 2],
];

// Magia de Pacto (Bruxo): [quantidade de espaços, nível dos espaços]
const TABELA_PACTO = [
  null,
  [1, 1],
  [2, 1],
  [2, 2],
  [2, 2],
  [2, 3],
  [2, 3],
  [2, 4],
  [2, 4],
  [2, 5],
  [2, 5],
  [3, 5],
  [3, 5],
  [3, 5],
  [3, 5],
  [3, 5],
  [3, 5],
  [4, 5],
  [4, 5],
  [4, 5],
  [4, 5],
];

// Aplica os novos totais (de obterEspacosPorNivel) num espacosMagia já
// existente, preservando quantos espaços já foram gastos no dia.
export function mesclarEspacosNoAtual(espacosAtuais, novosTotais) {
  const mesclado = {};
  for (let n = 1; n <= 9; n += 1) {
    mesclado[n] = {
      usados: espacosAtuais?.[n]?.usados ?? 0,
      total: novosTotais[n] ?? 0,
    };
  }
  return mesclado;
}

// Devolve um mapa { "1": total, "2": total, ..., "9": total } pronto pra
// mesclar no espacosMagia da ficha, ou null se a classe não conjura.
export function obterEspacosPorNivel(classeId, nivel) {
  const tipo = TIPO_CONJURADOR[classeId];
  if (!tipo) return null;

  const nivelValido = Math.min(Math.max(nivel, 1), 20);
  const espacos = {};
  for (let n = 1; n <= 9; n += 1) espacos[n] = 0;

  if (tipo === "completo") {
    TABELA_COMPLETA[nivelValido].forEach((total, indice) => {
      espacos[indice + 1] = total;
    });
  } else if (tipo === "metade") {
    TABELA_METADE[nivelValido].forEach((total, indice) => {
      espacos[indice + 1] = total;
    });
  } else if (tipo === "pacto") {
    const [quantidade, nivelSlot] = TABELA_PACTO[nivelValido];
    espacos[nivelSlot] = quantidade;
  }

  return espacos;
}
