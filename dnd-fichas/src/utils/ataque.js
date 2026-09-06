import { formatarModificador } from "./dnd";
import { obterItemCatalogo } from "../data/catalogoItens";

export function criarAtaqueApartirDeItemEquipado(itemInventario) {
  const catalogo = obterItemCatalogo(itemInventario.origemId);
  const arma = catalogo?.original;
  if (!arma) return null;

  const usaDestrezaAuto =
    arma.tipo === "distancia" || arma.propriedades.includes("acuidade");
  const override = itemInventario.atributoAtaque;
  const atributo =
    override && override !== "auto"
      ? override
      : usaDestrezaAuto
      ? "destreza"
      : "forca";

  return {
    id: itemInventario.id,
    nome: itemInventario.nome || arma.nome,
    atributo,
    dano: arma.dano,
    tipoDano: arma.tipoDano ?? "",
    bonusManual: 0,
    origemId: arma.id,
  };
}

export function criarAtaqueVazio() {
  return {
    id: crypto.randomUUID(),
    nome: "",
    atributo: "manual",
    dano: "",
    tipoDano: "",
    bonusManual: 0,
    origemId: null,
  };
}

export function calcularBonusAcerto(ataque, modificadoresAtributos, bonusProficiencia) {
  if (ataque.atributo === "manual") return ataque.bonusManual ?? 0;
  return (modificadoresAtributos[ataque.atributo] ?? 0) + bonusProficiencia;
}

export function formatarDano(ataque, modificadoresAtributos) {
  if (!ataque.dano) return "—";
  if (ataque.atributo === "manual") {
    return `${ataque.dano}${ataque.tipoDano ? ` ${ataque.tipoDano}` : ""}`;
  }
  const mod = modificadoresAtributos[ataque.atributo] ?? 0;
  const sufixoMod = mod !== 0 ? formatarModificador(mod) : "";
  return `${ataque.dano}${sufixoMod}${ataque.tipoDano ? ` ${ataque.tipoDano}` : ""}`;
}
