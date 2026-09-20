import { RECURSOS_CLASSES } from "./recursosClasses";
import { RECURSOS_SUBCLASSES } from "./recursosSubclasses";
import { TALENTOS } from "./talentos";
import { ITENS_MAGICOS } from "./itensMagicos";

function recursosAninhados(catalogo, tipo, chaveOrigem) {
  return catalogo.flatMap((entrada) =>
    (entrada.recursos ?? []).map((recurso) => ({
      ...recurso,
      origem: { tipo, [chaveOrigem]: entrada.id, ...(recurso.origem ?? {}) },
    }))
  );
}

export const RECURSOS_TALENTOS = recursosAninhados(TALENTOS, "talento", "talentoId");
export const RECURSOS_ITENS = recursosAninhados(ITENS_MAGICOS, "item", "itemId");

// Regras gerais podem ser acrescentadas aqui sem alterar a interface. A
// restauração manual cobre marcadores que dependem do mestre ou de eventos.
export const RECURSOS_REGRAS = [
  {
    id: "inspiracao",
    nome: "Inspiração",
    origem: { tipo: "geral" },
    formulaMaximo: { base: 1, minimo: 1 },
    restauraEm: "manual",
  },
];

export const RECURSOS_RASTREAVEIS = [
  ...RECURSOS_CLASSES,
  ...RECURSOS_SUBCLASSES,
  ...RECURSOS_TALENTOS,
  ...RECURSOS_ITENS,
  ...RECURSOS_REGRAS,
];

export function obterRecursoRastreavel(id) {
  return RECURSOS_RASTREAVEIS.find((recurso) => recurso.id === id) ?? null;
}
