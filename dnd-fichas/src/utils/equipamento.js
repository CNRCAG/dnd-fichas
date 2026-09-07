import { obterItemCatalogo } from "../data/catalogoItens";

// Pega os itens de inventário que são armadura/escudo, equipados, e resolve
// os dados completos deles no catálogo (dano, ca etc. não ficam duplicados
// na ficha, só a referência via origemId).
function armadurasEquipadas(inventario) {
  return inventario
    .filter((item) => item.tipoItem === "armadura" && item.equipado && item.origemId)
    .map((item) => obterItemCatalogo(item.origemId)?.original)
    .filter(Boolean);
}

export function calcularCaEquipada(inventario, modificadoresAtributos, classeId) {
  const equipadas = armadurasEquipadas(inventario);
  const corpo = equipadas.find((armadura) => armadura.tipo !== "escudo");
  const escudo = equipadas.find((armadura) => armadura.tipo === "escudo");
  const modDestreza = modificadoresAtributos.destreza;

  let ca;
  if (corpo) {
    const bonusDes =
      corpo.caModDes === "total"
        ? modDestreza
        : corpo.caModDes === "max2"
        ? Math.min(modDestreza, 2)
        : 0;
    ca = corpo.caBase + bonusDes;
  } else if (classeId === "barbaro") {
    // Defesa sem Armadura do Bárbaro: 10 + DES + CON (aceita escudo)
    ca = 10 + modDestreza + modificadoresAtributos.constituicao;
  } else if (classeId === "monge" && !escudo) {
    // Defesa sem Armadura do Monge: 10 + DES + SAB (só sem escudo)
    ca = 10 + modDestreza + modificadoresAtributos.sabedoria;
  } else {
    ca = 10 + modDestreza;
  }

  if (escudo) {
    ca += escudo.caBase;
  }

  return ca;
}

export function temArmaduraEquipada(inventario) {
  return armadurasEquipadas(inventario).length > 0;
}
