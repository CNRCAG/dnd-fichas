import { obterEspacosPorNivel } from "./conjuracao";
import { classesDaMagia } from "../data/magiasClasses";

const CLASSES_COM_TRUQUES = new Set([
  "bardo", "bruxo", "clerigo", "druida", "feiticeiro", "mago",
]);

// Espaços combinados de multiclasse servem para conjurar, não para determinar
// quais níveis de magia cada classe pode aprender ou preparar.
export function nivelMaximoMagiaDaClasse(classeId, nivelClasse) {
  if (!classeId || !Number.isInteger(Number(nivelClasse)) || Number(nivelClasse) < 1) {
    return -1;
  }

  const espacos = obterEspacosPorNivel(classeId, Number(nivelClasse));
  if (!espacos) return -1;
  const maiorNivel = Math.max(
    0,
    ...Object.entries(espacos)
      .filter(([, quantidade]) => Number(quantidade) > 0)
      .map(([nivel]) => Number(nivel))
  );
  return maiorNivel > 0 || CLASSES_COM_TRUQUES.has(classeId) ? maiorNivel : -1;
}

export function classesQueAcessamNivel(ficha, nivelMagia) {
  const classes = [
    { classeId: ficha.classeId, nivel: ficha.nivel ?? 1 },
    ...(ficha.classesSecundarias ?? []),
  ];
  return classes.filter(({ classeId, nivel }) => {
    if (nivelMagia === 0) return Number(nivel) >= 1 && CLASSES_COM_TRUQUES.has(classeId);
    // Arcano Místico do bruxo concede uma magia de cada círculo 6–9,
    // separada dos espaços de Magia de Pacto e das magias conhecidas.
    if (classeId === "bruxo" && nivelMagia >= 6 && nivelMagia <= 9) {
      return Number(nivel) >= 11 + 2 * (nivelMagia - 6);
    }
    return nivelMaximoMagiaDaClasse(classeId, nivel) >= nivelMagia;
  });
}

export function classesElegiveisParaMagia(ficha, magiaCatalogo) {
  const classesPermitidas = classesDaMagia(magiaCatalogo.id);
  return classesQueAcessamNivel(ficha, magiaCatalogo.nivel).filter(
    ({ classeId }) => classesPermitidas.includes(classeId)
  );
}
