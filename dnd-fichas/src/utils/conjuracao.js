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

export function tipoConjurador(classeId, subclasseId) {
  if (
    (classeId === "guerreiro" && subclasseId === "cavaleiro-arcano") ||
    (classeId === "ladino" && subclasseId === "trapaceiro-arcano")
  ) {
    return "terco";
  }

  return TIPO_CONJURADOR[classeId] ?? null;
}

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
export function obterEspacosPorNivel(classeId, nivel, subclasseId = null) {
  const tipo = tipoConjurador(classeId, subclasseId);
  if (!tipo) return null;

  const nivelValido = Math.min(Math.max(Number(nivel), 1), 20);
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
  } else if (tipo === "terco" && nivelValido >= 3) {
    TABELA_COMPLETA[Math.ceil(nivelValido / 3)].forEach((total, indice) => {
      espacos[indice + 1] = total;
    });
  } else if (tipo === "pacto") {
    const [quantidade, nivelSlot] = TABELA_PACTO[nivelValido];
    espacos[nivelSlot] = quantidade;
  }

  return espacos;
}

// Espaços de magia combinados de multiclasse: conjuradores completos
// somam o nível inteiro, de metade somam metade (pra baixo). O Bruxo
// NUNCA entra nessa soma — ele sempre usa a tabela de Magia de Pacto
// separada, então devolvemos os dois resultados independentes.
export function obterEspacosCombinadosMulticlasse(classesComNiveis) {
  const conjuradoresRegulares = [];
  let nivelBruxo = null;

  for (const classe of classesComNiveis) {
    const nivel = Number(classe.nivel);
    const tipo = tipoConjurador(classe.classeId, classe.subclasseId);

    if (tipo === "pacto") {
      nivelBruxo = nivel;
    } else if (tipo && !(tipo === "terco" && nivel < 3)) {
      conjuradoresRegulares.push({ ...classe, nivel, tipo });
    }
  }

  let espacosRegulares = null;

  if (conjuradoresRegulares.length === 1) {
    const classe = conjuradoresRegulares[0];
    espacosRegulares = obterEspacosPorNivel(
      classe.classeId,
      classe.nivel,
      classe.subclasseId
    );
  } else if (conjuradoresRegulares.length > 1) {
    const nivelCombinado = conjuradoresRegulares.reduce((total, classe) => {
      if (classe.tipo === "completo") return total + classe.nivel;
      if (classe.tipo === "metade") {
        return total + Math.floor(classe.nivel / 2);
      }
      return total + Math.floor(classe.nivel / 3);
    }, 0);

    if (nivelCombinado > 0) {
      espacosRegulares = {};
      TABELA_COMPLETA[Math.min(nivelCombinado, 20)].forEach(
        (quantidade, indice) => {
          espacosRegulares[indice + 1] = quantidade;
        }
      );
    }
  }

  let espacosPacto = null;
  if (nivelBruxo !== null) {
    const [quantidade, nivel] =
      TABELA_PACTO[Math.min(Math.max(nivelBruxo, 1), 20)];
    espacosPacto = { quantidade, nivel };
  }

  return { espacosRegulares, espacosPacto };
}

export function mesclarEspacosPacto(atual, novo) {
  if (!novo) return null;
  return { ...novo, usados: Math.min(atual?.usados ?? 0, novo.quantidade) };
}