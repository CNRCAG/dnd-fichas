function numeroSeguro(valor, padrao = 0) {
  return Number.isFinite(Number(valor)) ? Number(valor) : padrao;
}

function marcadorTesteMorte(valor) {
  return Math.min(3, Math.max(0, Math.floor(numeroSeguro(valor))));
}

export function atualizarStatus(statusAtual, chave, valor) {
  const status = { ...(statusAtual ?? {}) };

  if (chave === "pvMax") {
    status.pvMax = Math.max(1, Math.floor(numeroSeguro(valor, 1)));
    status.pvAtual = Math.min(
      status.pvMax,
      Math.max(0, numeroSeguro(status.pvAtual, status.pvMax))
    );
    return status;
  }

  if (chave === "pvAtual") {
    const pvMax = Math.max(1, numeroSeguro(status.pvMax, 1));
    status.pvAtual = Math.min(pvMax, Math.max(0, numeroSeguro(valor)));
    if (status.pvAtual > 0) {
      status.testesMorteSucessos = 0;
      status.testesMorteFalhas = 0;
    }
    return status;
  }

  if (chave === "pvTemp") {
    status.pvTemp = Math.max(0, Math.floor(numeroSeguro(valor)));
    return status;
  }

  if (chave === "testesMorteSucessos" || chave === "testesMorteFalhas") {
    status[chave] = marcadorTesteMorte(valor);
    return status;
  }

  status[chave] = numeroSeguro(valor);
  return status;
}

export function estadoTestesMorte(status = {}) {
  const sucessos = marcadorTesteMorte(status.testesMorteSucessos);
  const falhas = marcadorTesteMorte(status.testesMorteFalhas);
  return {
    sucessos,
    falhas,
    emAgonia: numeroSeguro(status.pvAtual) <= 0,
    estabilizado: sucessos >= 3 && falhas < 3,
    morto: falhas >= 3,
  };
}

export function alternarTesteMorte(statusAtual, tipo, indice) {
  const estado = estadoTestesMorte(statusAtual);
  if (tipo === "sucesso" && estado.morto) return { ...statusAtual };
  if (tipo === "falha" && estado.estabilizado) return { ...statusAtual };

  const chave = tipo === "sucesso" ? "testesMorteSucessos" : "testesMorteFalhas";
  const atual = tipo === "sucesso" ? estado.sucessos : estado.falhas;
  const alvo = Math.min(3, Math.max(0, Math.floor(numeroSeguro(indice)) + 1));
  return atualizarStatus(statusAtual, chave, atual === alvo ? alvo - 1 : alvo);
}

export function reiniciarTestesMorte(statusAtual) {
  return {
    ...(statusAtual ?? {}),
    testesMorteSucessos: 0,
    testesMorteFalhas: 0,
  };
}
