export const NIVEL_MAXIMO_PERSONAGEM = 20;

export function normalizarNivel(nivel) {
  const numero = Number(nivel);
  if (!Number.isFinite(numero)) return 1;
  return Math.min(NIVEL_MAXIMO_PERSONAGEM, Math.max(1, Math.trunc(numero)));
}

export function calcularNivelTotal(ficha) {
  return normalizarNivel(ficha?.nivel) +
    (Array.isArray(ficha?.classesSecundarias) ? ficha.classesSecundarias : []).reduce(
      (total, classe) =>
        total + (classe?.classeId ? Math.max(0, Math.trunc(Number(classe.nivel) || 0)) : 0),
      0
    );
}

function retratoNiveis(ficha) {
  return {
    nivel: ficha?.nivel,
    classesSecundarias: (Array.isArray(ficha?.classesSecundarias)
      ? ficha.classesSecundarias
      : []
    ).map((classe) => ({ classeId: classe?.classeId ?? null, nivel: classe?.nivel })),
  };
}

// Barreira final aplicada a toda criação, atualização, carga e importação.
// O excesso é retirado primeiro das classes secundárias mais recentes.
export function normalizarNiveisFicha(ficha) {
  if (!ficha || typeof ficha !== "object") return ficha;

  const original = retratoNiveis(ficha);
  let nivel = normalizarNivel(ficha.nivel);
  const classesSecundarias = (Array.isArray(ficha.classesSecundarias)
    ? ficha.classesSecundarias
    : []
  ).map((classe) => ({
    ...classe,
    nivel: classe?.classeId ? normalizarNivel(classe.nivel) : 1,
  }));

  let excesso = nivel + classesSecundarias.reduce(
    (total, classe) => total + (classe.classeId ? classe.nivel : 0),
    0
  ) - NIVEL_MAXIMO_PERSONAGEM;

  for (let indice = classesSecundarias.length - 1; indice >= 0 && excesso > 0; indice -= 1) {
    const classe = classesSecundarias[indice];
    if (!classe.classeId) continue;
    const reducao = Math.min(excesso, Math.max(0, classe.nivel - 1));
    classe.nivel -= reducao;
    excesso -= reducao;
  }

  if (excesso > 0) {
    const reducaoPrincipal = Math.min(excesso, Math.max(0, nivel - 1));
    nivel -= reducaoPrincipal;
    excesso -= reducaoPrincipal;
  }

  // Só ocorre em JSON corrompido com mais de 20 entradas de classe. Mantemos
  // as linhas visíveis para correção, mas nível 0 não entra no total.
  for (let indice = classesSecundarias.length - 1; indice >= 0 && excesso > 0; indice -= 1) {
    const classe = classesSecundarias[indice];
    if (!classe.classeId || classe.nivel === 0) continue;
    classe.nivel = 0;
    excesso -= 1;
  }

  const normalizada = { ...ficha, nivel, classesSecundarias };
  const ajustada = JSON.stringify(original) !== JSON.stringify(retratoNiveis(normalizada));
  if (!ajustada) return normalizada;

  return {
    ...normalizada,
    normalizacaoNiveis: {
      ...(ficha.normalizacaoNiveis ?? {}),
      ajustado: true,
      motivo: "Os níveis foram ajustados para valores inteiros e nível total máximo 20.",
      original: ficha.normalizacaoNiveis?.original ?? original,
    },
  };
}
