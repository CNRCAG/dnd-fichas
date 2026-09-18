import { obterExcecaoMagia } from "../data/magiasExcecoesSubclasse";
import { obterEspacosPorNivel, tipoConjurador } from "./conjuracao";
import { classesDaMagia } from "../data/magiasClasses";
import { MAGIAS } from "../data/magiasSistema";

const CLASSES_COM_TRUQUES = new Set([
  "bardo", "bruxo", "clerigo", "druida", "feiticeiro", "mago",
]);

const ESCOLAS_CONJURACAO_PARCIAL = {
  "cavaleiro-arcano": ["abjuracao", "evocacao"],
  "trapaceiro-arcano": ["encantamento", "ilusao"],
};

function subclasseDaClasse(ficha, classeId) {
  return ficha.classeId === classeId
    ? { subclasseId: ficha.subclasseId, nivel: ficha.nivel }
    : (ficha.classesSecundarias ?? []).find(
        (classe) => classe.classeId === classeId
      );
}

export function limiteMagiasDeQualquerEscola(nivel) {
  return [3, 8, 14, 20].filter((marco) => Number(nivel) >= marco).length;
}

export function contarMagiasDeQualquerEscola(ficha, classeId) {
  const subclasseId = subclasseDaClasse(ficha, classeId)?.subclasseId;
  const escolas = ESCOLAS_CONJURACAO_PARCIAL[subclasseId];
  if (!escolas || tipoConjurador(classeId, subclasseId) !== "terco") return 0;

  return (ficha.magias ?? []).filter((magia) => {
    if (magia.classeId !== classeId || Number(magia.nivel) === 0) return false;
    const catalogo = MAGIAS.find((item) => item.id === magia.origemId)
      ?? MAGIAS.find((item) => item.nome.toLowerCase() === magia.nome?.trim().toLowerCase());
    return catalogo && !escolas.includes(catalogo.escola);
  }).length;
}

// Espaços combinados de multiclasse servem para conjurar, não para determinar
// quais níveis de magia cada classe pode aprender ou preparar.
export function nivelMaximoMagiaDaClasse(classeId, nivelClasse, subclasseId = null) {
  if (!classeId || !Number.isInteger(Number(nivelClasse)) || Number(nivelClasse) < 1) {
    return -1;
  }

  const espacos = obterEspacosPorNivel(
    classeId,
    Number(nivelClasse),
    subclasseId
  );
  if (!espacos) return -1;

  const maiorNivel = Math.max(
    0,
    ...Object.entries(espacos)
      .filter(([, quantidade]) => Number(quantidade) > 0)
      .map(([nivel]) => Number(nivel))
  );

  return maiorNivel > 0 || CLASSES_COM_TRUQUES.has(classeId)
    ? maiorNivel
    : -1;
}

export function classesQueAcessamNivel(ficha, nivelMagia) {
  const classes = [
    {
      classeId: ficha.classeId,
      nivel: ficha.nivel ?? 1,
      subclasseId: ficha.subclasseId,
    },
    ...(ficha.classesSecundarias ?? []),
  ];

  return classes.filter(({ classeId, nivel, subclasseId }) => {
    if (nivelMagia === 0) {
      return (
        Number(nivel) >= 1 &&
        (CLASSES_COM_TRUQUES.has(classeId) ||
          (Number(nivel) >= 3 &&
            tipoConjurador(classeId, subclasseId) === "terco"))
      );
    }

    // Arcano Místico do Bruxo não usa os espaços de Magia de Pacto.
    if (classeId === "bruxo" && nivelMagia >= 6 && nivelMagia <= 9) {
      return Number(nivel) >= 11 + 2 * (nivelMagia - 6);
    }

    return (
      nivelMaximoMagiaDaClasse(classeId, nivel, subclasseId) >= nivelMagia
    );
  });
}

export function magiaPermitidaParaClasse(ficha, magiaCatalogo, classeId) {
  const dadosClasse = subclasseDaClasse(ficha, classeId);
  const subclasseId = dadosClasse?.subclasseId;

  if (tipoConjurador(classeId, subclasseId) === "terco") {
    if (!classesDaMagia(magiaCatalogo.id).includes("mago")) return false;
    if (Number(magiaCatalogo.nivel) === 0) return true;

    return (
      ESCOLAS_CONJURACAO_PARCIAL[subclasseId].includes(magiaCatalogo.escola) ||
      limiteMagiasDeQualquerEscola(dadosClasse.nivel) > 0
    );
  }

  return (
    classesDaMagia(magiaCatalogo.id).includes(classeId) ||
    Boolean(obterExcecaoMagia(ficha, magiaCatalogo.id, classeId))
  );
}

export function classesElegiveisParaMagia(ficha, magiaCatalogo, paraAdicionar = false) {
  return classesQueAcessamNivel(ficha, magiaCatalogo.nivel).filter(
    ({ classeId, nivel, subclasseId }) => {
      if (!magiaPermitidaParaClasse(ficha, magiaCatalogo, classeId)) return false;
      if (!paraAdicionar || Number(magiaCatalogo.nivel) === 0) return true;

      const escolas = ESCOLAS_CONJURACAO_PARCIAL[subclasseId];
      return !escolas || escolas.includes(magiaCatalogo.escola) ||
        contarMagiasDeQualquerEscola(ficha, classeId) <
          limiteMagiasDeQualquerEscola(nivel);
    }
  );
}
