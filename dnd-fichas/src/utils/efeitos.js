import { calcularCdConcentracao } from "./concentracao";

export function avisoConcentracaoPorDano(concentracao, danoRecebido) {
  return concentracao && Number(danoRecebido) > 0
    ? { cd: calcularCdConcentracao(danoRecebido) }
    : null;
}

export function aplicarEfeitoPv(statusAtual, tipo, valor) {
  const status = { ...statusAtual };
  const quantidade = Math.max(0, Math.floor(Number(valor) || 0));
  const pvMax = Math.max(1, Number(status.pvMax) || 1);
  const pvAtual = Math.min(pvMax, Math.max(0, Number(status.pvAtual) || 0));
  const pvTemp = Math.max(0, Number(status.pvTemp) || 0);

  if (tipo === "cura") {
    status.pvAtual = Math.min(pvMax, pvAtual + quantidade);
    if (status.pvAtual > 0) {
      status.testesMorteSucessos = 0;
      status.testesMorteFalhas = 0;
    }
    return { status, danoRecebido: 0, valorAplicado: status.pvAtual - pvAtual };
  }

  const absorvido = Math.min(pvTemp, quantidade);
  const danoNosPv = Math.min(pvAtual, quantidade - absorvido);
  status.pvTemp = pvTemp - absorvido;
  status.pvAtual = pvAtual - danoNosPv;
  return {
    status,
    danoRecebido: quantidade,
    valorAplicado: absorvido + danoNosPv,
  };
}

export function duracaoEmRodadas(duracao) {
  const texto = String(duracao ?? "").toLocaleLowerCase();
  const match = texto.match(/(\d+)\s*(rodada|minuto|hora|dia)/);
  if (!match) return texto.includes("instant") ? 1 : null;
  const quantidade = Number(match[1]);
  if (match[2] === "rodada") return quantidade;
  if (match[2] === "minuto") return quantidade * 10;
  if (match[2] === "hora") return quantidade * 600;
  return quantidade * 14400;
}

export function criarCondicaoAtiva(
  { nome, fonte, fonteId = null, duracao = "" },
  criarId = () => crypto.randomUUID()
) {
  return {
    id: criarId(),
    nome: String(nome ?? "").trim(),
    fonte: String(fonte ?? "").trim(),
    fonteId,
    duracao,
    rodadasRestantes: duracaoEmRodadas(duracao),
  };
}

export function adicionarCondicao(condicoes, novaCondicao) {
  const atuais = condicoes ?? [];
  const chave = `${novaCondicao.fonteId ?? novaCondicao.fonte}:${novaCondicao.nome}`;
  return [
    ...atuais.filter(
      (condicao) => `${condicao.fonteId ?? condicao.fonte}:${condicao.nome}` !== chave
    ),
    novaCondicao,
  ];
}

export function avancarCondicao(condicoes, condicaoId) {
  return (condicoes ?? []).flatMap((condicao) => {
    if (condicao.id !== condicaoId || condicao.rodadasRestantes === null) return [condicao];
    const restante = Math.max(0, Number(condicao.rodadasRestantes) - 1);
    return restante > 0 ? [{ ...condicao, rodadasRestantes: restante }] : [];
  });
}

export function normalizarCondicoes(condicoes) {
  return (Array.isArray(condicoes) ? condicoes : []).flatMap((condicao) => {
    if (!condicao || typeof condicao !== "object" || !String(condicao.nome ?? "").trim()) return [];
    const restanteOriginal = condicao.rodadasRestantes === undefined
      ? duracaoEmRodadas(condicao.duracao)
      : condicao.rodadasRestantes;
    const restante = restanteOriginal === null
      ? null
      : Math.max(0, Math.floor(Number(restanteOriginal) || 0));
    if (restante === 0) return [];
    return [{
      ...condicao,
      id: condicao.id ?? crypto.randomUUID(),
      nome: String(condicao.nome).trim(),
      fonte: String(condicao.fonte ?? "Manual").trim(),
      rodadasRestantes: restante,
    }];
  });
}
