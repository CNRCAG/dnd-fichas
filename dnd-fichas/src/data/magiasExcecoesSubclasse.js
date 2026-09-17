// Apenas magias que já existem em magiasSistema.js.
// As chaves numéricas representam o nível NA CLASSE, não o círculo da magia.
const EXCECOES_SUBCLASSE = {
  "dominio-vida": {
    classeId: "clerigo",
    tipo: "sempre-preparada",
    niveis: {
      1: ["bencao", "curar-ferimentos"],
      3: ["restauracao-menor"],
      5: ["revivificar"],
      9: ["cura-em-massa"],
    },
  },

  "patrono-corruptor": {
    classeId: "bruxo",
    tipo: "lista-expandida",
    niveis: {
      1: ["comando"],
      3: ["raio-ardente"],
      5: ["bola-de-fogo"],
      7: ["parede-de-fogo"],
    },
  },
};

export function obterExcecaoMagia(ficha, magiaId, classeId) {
  // Por enquanto, a ficha só guarda subclasse para a classe principal.
  if (ficha.classeId !== classeId) return null;

  const regra = EXCECOES_SUBCLASSE[ficha.subclasseId];
  if (!regra || regra.classeId !== classeId) return null;

  const disponivel = Object.entries(regra.niveis).some(
    ([nivelNecessario, ids]) =>
      Number(ficha.nivel) >= Number(nivelNecessario) &&
      ids.includes(magiaId)
  );

  return disponivel ? { tipo: regra.tipo } : null;
}