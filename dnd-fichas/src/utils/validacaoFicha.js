import { CLASSES } from "../data/classes";
import { TALENTOS } from "../data/talentos";
import { TIPO_CONJURADOR } from "./conjuracao";

const NIVEL_MAXIMO_PERSONAGEM = 20;

const PRE_REQUISITOS_MULTICLASSE = {
  barbaro: {
    descricao: "Força 13+",
    atende: (atributos) => atributos.forca >= 13,
  },
  bardo: {
    descricao: "Carisma 13+",
    atende: (atributos) => atributos.carisma >= 13,
  },
  bruxo: {
    descricao: "Carisma 13+",
    atende: (atributos) => atributos.carisma >= 13,
  },
  clerigo: {
    descricao: "Sabedoria 13+",
    atende: (atributos) => atributos.sabedoria >= 13,
  },
  druida: {
    descricao: "Sabedoria 13+",
    atende: (atributos) => atributos.sabedoria >= 13,
  },
  feiticeiro: {
    descricao: "Carisma 13+",
    atende: (atributos) => atributos.carisma >= 13,
  },
  guerreiro: {
    descricao: "Força 13+ ou Destreza 13+",
    atende: (atributos) => atributos.forca >= 13 || atributos.destreza >= 13,
  },
  ladino: {
    descricao: "Destreza 13+",
    atende: (atributos) => atributos.destreza >= 13,
  },
  mago: {
    descricao: "Inteligência 13+",
    atende: (atributos) => atributos.inteligencia >= 13,
  },
  monge: {
    descricao: "Destreza 13+ e Sabedoria 13+",
    atende: (atributos) => atributos.destreza >= 13 && atributos.sabedoria >= 13,
  },
  paladino: {
    descricao: "Força 13+ e Carisma 13+",
    atende: (atributos) => atributos.forca >= 13 && atributos.carisma >= 13,
  },
  patrulheiro: {
    descricao: "Destreza 13+ e Sabedoria 13+",
    atende: (atributos) => atributos.destreza >= 13 && atributos.sabedoria >= 13,
  },
};

function adicionar(lista, mensagem) {
  if (!lista.includes(mensagem)) lista.push(mensagem);
}

function numeroInteiroNoIntervalo(valor, minimo, maximo) {
  return Number.isInteger(Number(valor)) && Number(valor) >= minimo && Number(valor) <= maximo;
}

function nomeClasse(classeId) {
  return CLASSES.find((classe) => classe.id === classeId)?.nome ?? classeId;
}

function nivelMaximoDeEspaco(ficha) {
  const nivelRegular = Math.max(
    0,
    ...Object.entries(ficha.espacosMagia ?? [])
      .filter(([, espaco]) => Number(espaco?.total) > 0)
      .map(([nivel]) => Number(nivel))
  );
  const nivelPacto = Number(ficha.espacosMagiaPacto?.quantidade) > 0
    ? Number(ficha.espacosMagiaPacto?.nivel) || 0
    : 0;
  return Math.max(nivelRegular, nivelPacto);
}

export function validarFicha(ficha, atributosTotais) {
  const erros = [];
  const avisos = [];
  const atributos = atributosTotais ?? {};
  const classesSecundarias = ficha.classesSecundarias ?? [];

  if (!ficha.racaId) adicionar(erros, "Escolha uma raça.");
  if (!ficha.classeId) adicionar(erros, "Escolha uma classe principal.");
  if (!ficha.antecedenteId) adicionar(erros, "Escolha um antecedente.");

  for (const [atributo, valor] of Object.entries(atributos)) {
    if (!numeroInteiroNoIntervalo(valor, 1, 30)) {
      adicionar(erros, `${atributo}: informe um valor inteiro entre 1 e 30.`);
    } else if (valor > 20) {
      adicionar(
        avisos,
        `${atributo} está acima de 20; confirme uma característica que aumente o máximo desse atributo.`
      );
    }
  }

  const classesComNivel = [
    { classeId: ficha.classeId, nivel: ficha.nivel, rotulo: "classe principal" },
    ...classesSecundarias.map((classe, indice) => ({
      ...classe,
      rotulo: `classe secundária ${indice + 1}`,
    })),
  ];
  const classesVistas = new Set();
  let nivelTotal = 0;

  for (const classe of classesComNivel) {
    if (!classe.classeId) {
      if (classe.rotulo !== "classe principal") {
        adicionar(erros, `${classe.rotulo}: escolha uma classe ou remova esta linha.`);
      }
      continue;
    }

    if (!CLASSES.some((item) => item.id === classe.classeId)) {
      adicionar(erros, `${classe.rotulo}: classe desconhecida.`);
    }
    if (classesVistas.has(classe.classeId)) {
      adicionar(erros, `A classe ${nomeClasse(classe.classeId)} foi incluída mais de uma vez.`);
    }
    classesVistas.add(classe.classeId);

    if (!numeroInteiroNoIntervalo(classe.nivel, 1, NIVEL_MAXIMO_PERSONAGEM)) {
      adicionar(
        erros,
        `${nomeClasse(classe.classeId)}: o nível deve ser um inteiro de 1 a ${NIVEL_MAXIMO_PERSONAGEM}.`
      );
      continue;
    }
    nivelTotal += Number(classe.nivel);
  }

  if (nivelTotal > NIVEL_MAXIMO_PERSONAGEM) {
    adicionar(erros, `O nível total é ${nivelTotal}; o máximo permitido é ${NIVEL_MAXIMO_PERSONAGEM}.`);
  }

  const temMulticlasse = classesSecundarias.some((classe) => classe.classeId);
  if (temMulticlasse && ficha.classeId) {
    for (const classe of classesComNivel.filter((item) => item.classeId)) {
      const requisito = PRE_REQUISITOS_MULTICLASSE[classe.classeId];
      if (requisito && !requisito.atende(atributos)) {
        adicionar(
          erros,
          `Multiclasse em ${nomeClasse(classe.classeId)} requer ${requisito.descricao}.`
        );
      }
    }
  }

  for (const [nivel, espaco] of Object.entries(ficha.espacosMagia ?? {})) {
    const usados = Number(espaco?.usados) || 0;
    const total = Number(espaco?.total) || 0;
    if (usados < 0 || total < 0 || usados > total) {
      adicionar(erros, `Espaços de magia de nível ${nivel}: usos devem ficar entre 0 e o total.`);
    }
  }

  const espacoPacto = ficha.espacosMagiaPacto;
  if (espacoPacto) {
    const usados = Number(espacoPacto.usados) || 0;
    const quantidade = Number(espacoPacto.quantidade) || 0;
    if (usados < 0 || quantidade < 0 || usados > quantidade) {
      adicionar(erros, "Espaços de Magia de Pacto: usos devem ficar entre 0 e o total.");
    }
  }

  const nivelMaximoEspaco = nivelMaximoDeEspaco(ficha);
  const possuiClasseConjuradora = classesComNivel.some(
    (classe) => TIPO_CONJURADOR[classe.classeId]
  );
  if ((ficha.magias ?? []).length > 0 && !possuiClasseConjuradora) {
    adicionar(
      avisos,
      "A ficha tem magias, mas não possui uma classe conjuradora; confirme se elas vêm de talento, item ou outra regra."
    );
  }
  for (const magia of ficha.magias ?? []) {
    if (!numeroInteiroNoIntervalo(magia.nivel, 0, 9)) {
      adicionar(erros, `${magia.nome || "Magia sem nome"}: informe um nível de magia entre 0 e 9.`);
    } else if (magia.nivel > 0 && magia.nivel > nivelMaximoEspaco) {
      adicionar(
        avisos,
        `${magia.nome || "Magia sem nome"} é de nível ${magia.nivel}, mas não há espaço disponível desse nível ou maior.`
      );
    }
  }

  for (const habilidade of ficha.habilidades ?? []) {
    if (habilidade.tipo !== "talento") continue;
    const talento = TALENTOS.find((item) => item.id === habilidade.origemId);
    const requisito = talento?.preRequisito;
    if (requisito?.atributo && atributos[requisito.atributo] < requisito.valorMinimo) {
      adicionar(
        avisos,
        `${talento.nome} requer ${requisito.atributo} ${requisito.valorMinimo}+; a ficha tem ${atributos[requisito.atributo] ?? 0}.`
      );
    }
    if (requisito?.conjurador && !possuiClasseConjuradora) {
      adicionar(avisos, `${talento.nome} requer que o personagem seja conjurador.`);
    }
  }

  const status = ficha.status ?? {};
  if (Number(status.pvMax) < 1) adicionar(erros, "PV máximo deve ser pelo menos 1.");
  if (Number(status.pvAtual) > Number(status.pvMax)) {
    adicionar(erros, "PV atual não pode ser maior que o PV máximo.");
  }
  if (Number(status.pvTemp) < 0) adicionar(erros, "PV temporário não pode ser negativo.");

  for (const recurso of ficha.recursos ?? []) {
    if (Number(recurso.usosGastos) < 0 || Number(recurso.usosGastos) > Number(recurso.usosMax)) {
      adicionar(erros, `${recurso.nome || "Recurso sem nome"}: usos gastos devem ficar entre 0 e o máximo.`);
    }
  }

  return { erros, avisos, pronta: erros.length === 0 };
}
