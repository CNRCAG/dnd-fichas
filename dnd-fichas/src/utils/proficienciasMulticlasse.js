import {
  obterRegraMulticlasse,
  periciasDisponiveisMulticlasse,
} from "../data/proficienciasMulticlasse";

function semDuplicatas(itens) {
  return [...new Set(itens ?? [])];
}

export function concederProficienciasMulticlasse(ficha, classeId) {
  const regra = obterRegraMulticlasse(classeId) ?? {};
  const existentes = ficha.proficienciasMulticlasse ?? {};
  if (existentes[classeId]) return {};

  return {
    proficienciasArmas: semDuplicatas([
      ...(ficha.proficienciasArmas ?? []),
      ...(regra.armas ?? []),
    ]),
    proficienciasArmaduras: semDuplicatas([
      ...(ficha.proficienciasArmaduras ?? []),
      ...(regra.armaduras ?? []),
    ]),
    proficienciasEscudos: Boolean(ficha.proficienciasEscudos || regra.escudos),
    proficienciasFerramentas: semDuplicatas([
      ...(ficha.proficienciasFerramentas ?? []),
      ...(regra.ferramentas ?? []),
    ]),
    proficienciasMulticlasse: {
      ...existentes,
      [classeId]: {
        classeId,
        armas: regra.armas ?? [],
        armaduras: regra.armaduras ?? [],
        escudos: Boolean(regra.escudos),
        ferramentas: regra.ferramentas ?? [],
        pericias: [],
        escolhas: regra.escolhas ?? [],
      },
    },
  };
}

export function escolherPericiaMulticlasse(ficha, classeId, periciaId) {
  const registro = ficha.proficienciasMulticlasse?.[classeId];
  const quantidade = registro?.escolhas
    ?.filter((escolha) => escolha.tipo === "pericia")
    .reduce((total, escolha) => total + escolha.quantidade, 0) ?? 0;
  const escolhidas = registro?.pericias ?? [];
  const disponiveis = periciasDisponiveisMulticlasse(ficha.pericias);
  if (!registro || escolhidas.length >= quantidade || !disponiveis.some((item) => item.chave === periciaId)) {
    return {};
  }
  return {
    pericias: { ...(ficha.pericias ?? {}), [periciaId]: true },
    proficienciasMulticlasse: {
      ...ficha.proficienciasMulticlasse,
      [classeId]: { ...registro, pericias: [...escolhidas, periciaId] },
    },
  };
}

export function pendenciasProficienciasMulticlasse(ficha, classeId) {
  const registro = ficha.proficienciasMulticlasse?.[classeId];
  if (!registro) return [];
  const esperadas = registro.escolhas
    ?.filter((escolha) => escolha.tipo === "pericia")
    .reduce((total, escolha) => total + escolha.quantidade, 0) ?? 0;
  const faltam = Math.max(0, esperadas - (registro.pericias?.length ?? 0));
  return faltam > 0 ? [`Escolha ${faltam} perícia${faltam > 1 ? "s" : ""} da multiclasse.`] : [];
}
