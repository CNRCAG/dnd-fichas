// Regras de magia por subclasse. Os IDs referem-se exclusivamente a magias
// presentes no catálogo local; uma lista expandida só torna a magia elegível,
// enquanto uma magia sempre preparada é concedida automaticamente.

export const REGRAS_MAGIAS_SUBCLASSES = {
  "dominio-vida": {
    classeId: "clerigo",
    tipo: "sempre-preparada",
    niveis: { 1: ["bencao", "curar-ferimentos"], 3: ["restauracao-menor"], 5: ["revivificar"], 9: ["cura-em-massa"] },
  },
  "dominio-luz": {
    classeId: "clerigo",
    tipo: "sempre-preparada",
    concedidas: { 1: ["luz"] },
    niveis: { 3: ["raio-ardente"], 5: ["bola-de-fogo"], 7: ["parede-de-fogo"] },
  },
  "patrono-arquifada": {
    classeId: "bruxo",
    tipo: "lista-expandida",
    niveis: { 1: ["sono"], 3: ["invisibilidade"], 9: ["dominar-pessoa"] },
  },
  "patrono-corruptor": {
    classeId: "bruxo",
    tipo: "lista-expandida",
    niveis: { 1: ["comando"], 3: ["raio-ardente"], 5: ["bola-de-fogo"], 7: ["parede-de-fogo"] },
  },
  "juramento-devocao": {
    classeId: "paladino",
    tipo: "sempre-preparada",
    niveis: { 5: ["restauracao-menor"], 9: ["dissipar-magia"], 13: ["liberdade-de-movimento"] },
  },
  "juramento-vinganca": {
    classeId: "paladino",
    tipo: "sempre-preparada",
    niveis: { 5: ["passo-nebuloso"], 9: ["velocidade", "protecao-contra-energia"], 13: ["banimento"] },
  },
  "trapaceiro-arcano": {
    classeId: "ladino",
    tipo: "concedida",
    concedidas: { 3: ["maos-magicas"] },
  },
};

export function obterClasseDaFicha(ficha, classeId) {
  if (ficha.classeId === classeId) {
    return { classeId, nivel: ficha.nivel ?? 1, subclasseId: ficha.subclasseId, indice: null };
  }
  const indice = (ficha.classesSecundarias ?? []).findIndex(
    (classe) => classe.classeId === classeId
  );
  if (indice < 0) return null;
  const classe = ficha.classesSecundarias[indice];
  return { ...classe, indice };
}

export function obterRegraMagiaSubclasse(subclasseId) {
  return REGRAS_MAGIAS_SUBCLASSES[subclasseId] ?? null;
}

export function magiasDaRegraNoNivel(regra, nivel) {
  if (!regra) return [];
  return Object.entries(regra.niveis ?? {}).flatMap(([nivelNecessario, ids]) =>
    Number(nivel) >= Number(nivelNecessario) ? ids : []
  );
}

function magiasConcedidasNoNivel(regra, nivel) {
  return Object.entries(regra?.concedidas ?? {}).flatMap(([nivelNecessario, ids]) =>
    Number(nivel) >= Number(nivelNecessario) ? ids : []
  );
}

export function obterExcecaoMagia(ficha, magiaId, classeId) {
  const classe = obterClasseDaFicha(ficha, classeId);
  const regra = obterRegraMagiaSubclasse(classe?.subclasseId);
  if (!classe || !regra || regra.classeId !== classeId) return null;
  const concedida = magiasConcedidasNoNivel(regra, classe.nivel).includes(magiaId);
  if (concedida) return { tipo: "concedida", subclasseId: classe.subclasseId };
  return magiasDaRegraNoNivel(regra, classe.nivel).includes(magiaId)
    ? { tipo: regra.tipo, subclasseId: classe.subclasseId }
    : null;
}

export function obterMagiasSemprePreparadas(ficha) {
  const classes = [
    { classeId: ficha.classeId, nivel: ficha.nivel, subclasseId: ficha.subclasseId },
    ...(ficha.classesSecundarias ?? []),
  ];
  return classes.flatMap((classe) => {
    const regra = obterRegraMagiaSubclasse(classe.subclasseId);
    if (!regra || regra.tipo !== "sempre-preparada") return [];
    return magiasDaRegraNoNivel(regra, classe.nivel).map((magiaId) => ({
      magiaId,
      classeId: classe.classeId,
      subclasseId: classe.subclasseId,
      tipo: regra.tipo,
    }));
  });
}

export function obterMagiasConcedidas(ficha) {
  const classes = [
    { classeId: ficha.classeId, nivel: ficha.nivel, subclasseId: ficha.subclasseId },
    ...(ficha.classesSecundarias ?? []),
  ];
  return classes.flatMap((classe) => {
    const regra = obterRegraMagiaSubclasse(classe.subclasseId);
    if (!regra?.concedidas) return [];
    const ids = magiasConcedidasNoNivel(regra, classe.nivel);
    return ids.map((magiaId) => ({
      magiaId,
      classeId: classe.classeId,
      subclasseId: classe.subclasseId,
      tipo: "concedida",
    }));
  });
}
