import { ARMAS } from "./armas";
import { ARMADURAS } from "./armaduras";
import { EQUIPAMENTOS } from "./equipamentos";

// Junta armas, armaduras e equipamentos num formato único, pronto pra
// popular o menu "Adicionar Itens". Cada entrada guarda um "resumo" (linha
// curta, sempre visível) e os dados originais completos em "original"
// (usados na descrição retrátil).
export const CATALOGO_ITENS = [
  ...ARMAS.map((arma) => ({
    id: `arma-${arma.id}`,
    nome: arma.nome,
    grupo: "Armas",
    tipoItem: "arma",
    peso: arma.peso,
    custo: arma.custo,
    resumo: `${arma.dano ?? "—"} ${arma.tipoDano ?? ""}`.trim(),
    original: arma,
  })),
  ...ARMADURAS.map((armadura) => ({
    id: `armadura-${armadura.id}`,
    nome: armadura.nome,
    grupo: "Armaduras",
    tipoItem: "armadura",
    peso: armadura.peso,
    custo: armadura.custo,
    resumo: `CA ${armadura.ca}`,
    original: armadura,
  })),
  ...EQUIPAMENTOS.map((item) => ({
    id: `equipamento-${item.id}`,
    nome: item.nome,
    grupo: "Equipamentos",
    tipoItem: "equipamento",
    peso: item.peso,
    custo: item.custo,
    resumo: item.descricao ? item.descricao.slice(0, 40) + (item.descricao.length > 40 ? "…" : "") : `${item.peso} kg`,
    original: item,
  })),
];

export function obterItemCatalogo(id) {
  return CATALOGO_ITENS.find((item) => item.id === id) ?? null;
}
