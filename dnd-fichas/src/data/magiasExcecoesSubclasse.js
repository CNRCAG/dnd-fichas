// Regras de magia por subclasse. Os IDs referem-se exclusivamente a magias
// presentes no catálogo local; uma lista expandida só torna a magia elegível,
// enquanto uma magia sempre preparada é concedida automaticamente.

export const REGRAS_MAGIAS_SUBCLASSES = {
  "dominio-vida": {
    classeId: "clerigo",
    tipo: "sempre-preparada",
    niveis: { 1: ["bencao", "curar-ferimentos"], 3: ["restauracao-menor", "arma-espiritual"], 5: ["sinal-esperanca", "revivificar"], 7: ["protecao-contra-morte", "guardiao-da-fe"], 9: ["cura-em-massa", "reviver-os-mortos"] },
  },
  "dominio-luz": {
    classeId: "clerigo",
    tipo: "sempre-preparada",
    concedidas: { 1: ["luz"] },
    niveis: { 1: ["maos-flamejantes", "fogo-das-fadas"], 3: ["esfera-flamejante", "raio-ardente"], 5: ["luz-do-dia", "bola-de-fogo"], 7: ["guardiao-da-fe", "parede-de-fogo"], 9: ["coluna-de-chamas", "videncia"] },
  },
  "patrono-arquifada": {
    classeId: "bruxo",
    tipo: "lista-expandida",
    niveis: { 1: ["fogo-das-fadas", "sono"], 3: ["acalmar-emocoes", "forca-fantasmagorica"], 5: ["piscar", "ampliar-plantas"], 7: ["dominar-besta", "invisibilidade-maior"], 9: ["dominar-pessoa", "similaridade"] },
  },
  "patrono-corruptor": {
    classeId: "bruxo",
    tipo: "lista-expandida",
    niveis: { 1: ["maos-flamejantes", "comando"], 3: ["cegueira-surdez", "raio-ardente"], 5: ["bola-de-fogo", "nuvem-fetida"], 7: ["escudo-de-fogo", "parede-de-fogo"], 9: ["coluna-de-chamas", "consagrar"] },
  },
  "juramento-devocao": {
    classeId: "paladino",
    tipo: "sempre-preparada",
    niveis: { 3: ["protecao-contra-bem-e-mal", "santuario"], 5: ["restauracao-menor", "zona-da-verdade"], 9: ["sinal-esperanca", "dissipar-magia"], 13: ["liberdade-de-movimento", "guardiao-da-fe"], 17: ["comunhao", "coluna-de-chamas"] },
  },
  "juramento-vinganca": {
    classeId: "paladino",
    tipo: "sempre-preparada",
    niveis: { 3: ["perdicao", "marca-do-cacador"], 5: ["imobilizar-pessoa", "passo-nebuloso"], 9: ["velocidade", "protecao-contra-energia"], 13: ["banimento", "porta-dimensional"], 17: ["imobilizar-monstro", "videncia"] },
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
