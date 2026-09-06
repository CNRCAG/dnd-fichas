// Motor de rolagem de dados. Rola um dado individual e também sabe
// interpretar fórmulas em texto livre (ex: "1d8+3", "8d6", "3x(1d4+1)")
// devolvendo o total e o detalhe de cada dado rolado.

export function rolarDado(lados) {
  return Math.floor(Math.random() * lados) + 1;
}

export function rolarD20() {
  return rolarDado(20);
}

// Expande atalhos "Nx(...)" e "NxMdL" (usados nas magias, ex: 3 mísseis de
// 1d4+1 cada) em termos repetidos separados por "+", antes de somar tudo.
function expandirFormula(formula) {
  let texto = String(formula).toLowerCase().replace(/\s+/g, "");
  texto = texto.replace(/(\d+)x\(([^)]+)\)/g, (_, n, sub) =>
    Array(Number(n)).fill(sub).join("+")
  );
  texto = texto.replace(/(\d+)x(\d*d\d+(?:\+\d+)?)/g, (_, n, sub) =>
    Array(Number(n)).fill(sub).join("+")
  );
  return texto.replace(/[()]/g, "");
}

// Rola uma fórmula de dados completa (dano de arma, dano de magia, cura
// etc). Retorna { formula, total, detalhes } onde cada detalhe mostra os
// valores individuais que saíram em cada grupo de dados.
export function rolarFormula(formula) {
  const texto = expandirFormula(formula);
  const termos = texto.split("+").filter(Boolean);
  const detalhes = [];
  let total = 0;

  for (const termo of termos) {
    const matchDado = termo.match(/^(\d*)d(\d+)$/);
    if (matchDado) {
      const quantidade = Number(matchDado[1] || 1);
      const lados = Number(matchDado[2]);
      const rolagens = Array.from({ length: quantidade }, () => rolarDado(lados));
      const soma = rolagens.reduce((a, b) => a + b, 0);
      detalhes.push({ texto: `${quantidade}d${lados}`, rolagens, soma });
      total += soma;
    } else if (/^\d+$/.test(termo)) {
      const valor = Number(termo);
      detalhes.push({ texto: termo, rolagens: [], soma: valor });
      total += valor;
    }
  }

  return { formula, total, detalhes };
}

// Rola um teste d20 (atributo, perícia, salvaguarda, ataque) somando um
// modificador fixo. Retorna { d20, modificador, total }.
export function rolarTesteD20(modificador = 0) {
  const d20 = rolarD20();
  return { d20, modificador, total: d20 + modificador };
}
