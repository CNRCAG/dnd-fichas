// Modificador de atributo, regra padrão do 5e: (valor - 10) / 2, arredondado
// pra baixo.
export function calcularModificador(valor) {
  return Math.floor((valor - 10) / 2);
}

// Bônus de proficiência por nível, regra padrão do 5e: começa em +2 no
// nível 1 e sobe 1 ponto a cada 4 níveis.
export function calcularBonusProficiencia(nivel) {
  return 2 + Math.floor((Math.max(nivel, 1) - 1) / 4);
}

export function formatarModificador(mod) {
  return mod >= 0 ? `+${mod}` : `${mod}`;
}

// Os textos de dano das magias são descritivos (ex: "8d6 fogo (metade se
// resistir)"), então pra poder rolar extraímos só o primeiro trecho que
// parece uma notação de dado válida.
export function extrairDadosDoDano(texto) {
  if (!texto) return null;
  const combinacao = texto.match(/\d*d\d+(?:[+-]\d+)?/i);
  return combinacao ? combinacao[0] : null;
}

// Verifica se um texto de dano de arma é rolável: notação de dado
// ("1d8", "2d6+3") ou um valor fixo numérico ("1", caso da zarabatana).
// Armas sem dano de verdade (ex: Rede, cujo campo é "—") não são.
export function podeRolarDano(texto) {
  if (!texto) return false;
  const limpo = texto.trim();
  return /^\d*d\d+([+-]\d+)?$/i.test(limpo) || /^\d+$/.test(limpo);
}

export const ATRIBUTOS = [
  { chave: "forca", label: "Força", abreviacao: "FOR" },
  { chave: "destreza", label: "Destreza", abreviacao: "DES" },
  { chave: "constituicao", label: "Constituição", abreviacao: "CON" },
  { chave: "inteligencia", label: "Inteligência", abreviacao: "INT" },
  { chave: "sabedoria", label: "Sabedoria", abreviacao: "SAB" },
  { chave: "carisma", label: "Carisma", abreviacao: "CAR" },
];

// Calcula o modificador final de cada atributo (base + bônus racial), num
// mapa pronto pra ser usado por perícias e salvaguardas.
export function calcularModificadoresAtributos(atributos, bonusRacial = {}) {
  const resultado = {};
  for (const atributo of ATRIBUTOS) {
    const total = atributos[atributo.chave] + (bonusRacial[atributo.chave] ?? 0);
    resultado[atributo.chave] = calcularModificador(total);
  }
  return resultado;
}
