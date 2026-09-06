// PV por nível, com histórico banked (ficha.pvPorNivel = { 1: valor, 2:
// valor, ... }). Isso existe pra resolver um problema específico: sem
// isso, subir pro nível 20 e depois voltar pro nível 1 "esquecia" o PV
// que deveria sumir, e subir de novo dava PV em dobro (ou deixava
// rerolar o dado quantas vezes quisesse). Com o histórico banked:
// - cada nível só tem seu valor de PV definido (rolado ou média) UMA
//   vez, na primeira vez que você chega nele;
// - descer de nível não apaga esse histórico, só para de somá-lo;
// - subir de novo reaproveita o valor já banked, em vez de gerar um novo.

export function valorMediaPv(classe, modCon) {
  return Math.max(1, Math.floor(classe.dadoVida / 2) + 1 + modCon);
}

export function valorPvNivel1(classe, modCon) {
  return classe.dadoVida + modCon;
}

// Recalcula pvMax/pvAtual pro nível informado. `override` (opcional) fixa
// o valor de um nível específico ainda não banked (ex: { 5: 8 } depois de
// rolar o dado no nível 5). Preenche automaticamente pela média qualquer
// nível ainda sem valor banked. Preserva o dano atual (pvMax - pvAtual)
// em vez de somar/subtrair deltas, então subir e descer não empilha nem
// cura de graça.
export function recalcularPv(fichaAtual, classe, modCon, novoNivel, override) {
  const pvPorNivel = { ...(fichaAtual.pvPorNivel ?? {}) };

  if (override) {
    Object.assign(pvPorNivel, override);
  }

  if (classe) {
    for (let n = 1; n <= novoNivel; n += 1) {
      if (pvPorNivel[n] == null) {
        pvPorNivel[n] =
          n === 1 ? valorPvNivel1(classe, modCon) : valorMediaPv(classe, modCon);
      }
    }
  }

  let novoPvMax = 0;
  for (let n = 1; n <= novoNivel; n += 1) {
    novoPvMax += pvPorNivel[n] ?? 0;
  }

  const danoAtual = Math.max(
    0,
    (fichaAtual.status?.pvMax ?? 0) - (fichaAtual.status?.pvAtual ?? 0)
  );
  const novoPvAtual = Math.max(0, novoPvMax - danoAtual);

  return {
    pvPorNivel,
    status: { ...fichaAtual.status, pvMax: novoPvMax, pvAtual: novoPvAtual },
  };
}
