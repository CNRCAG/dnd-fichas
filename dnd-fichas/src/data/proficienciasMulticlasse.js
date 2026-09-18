// Proficiências concedidas ao entrar em uma classe por multiclasse (PHB 2014).
// Elas são intencionalmente menores que as da classe inicial.

import { PERICIAS } from "./pericias";

export const PRE_REQUISITOS_MULTICLASSE = {
  barbaro: { descricao: "Força 13+", atende: (atributos) => atributos.forca >= 13 },
  bardo: { descricao: "Carisma 13+", atende: (atributos) => atributos.carisma >= 13 },
  bruxo: { descricao: "Carisma 13+", atende: (atributos) => atributos.carisma >= 13 },
  clerigo: { descricao: "Sabedoria 13+", atende: (atributos) => atributos.sabedoria >= 13 },
  druida: { descricao: "Sabedoria 13+", atende: (atributos) => atributos.sabedoria >= 13 },
  feiticeiro: { descricao: "Carisma 13+", atende: (atributos) => atributos.carisma >= 13 },
  guerreiro: { descricao: "Força 13+ ou Destreza 13+", atende: (atributos) => atributos.forca >= 13 || atributos.destreza >= 13 },
  ladino: { descricao: "Destreza 13+", atende: (atributos) => atributos.destreza >= 13 },
  mago: { descricao: "Inteligência 13+", atende: (atributos) => atributos.inteligencia >= 13 },
  monge: { descricao: "Destreza 13+ e Sabedoria 13+", atende: (atributos) => atributos.destreza >= 13 && atributos.sabedoria >= 13 },
  paladino: { descricao: "Força 13+ e Carisma 13+", atende: (atributos) => atributos.forca >= 13 && atributos.carisma >= 13 },
  patrulheiro: { descricao: "Destreza 13+ e Sabedoria 13+", atende: (atributos) => atributos.destreza >= 13 && atributos.sabedoria >= 13 },
};

export const PROFICIENCIAS_MULTICLASSE = {
  barbaro: { armas: ["simples", "marciais"], escudos: true },
  bardo: { armaduras: ["leves"], escolhas: [{ tipo: "pericia", quantidade: 1 }] },
  bruxo: { armaduras: ["leves"], armas: ["simples"] },
  clerigo: { armaduras: ["leves", "medias"], escudos: true },
  druida: { armaduras: ["leves", "medias"], escudos: true },
  feiticeiro: {},
  guerreiro: { armaduras: ["leves", "medias"], armas: ["simples", "marciais"], escudos: true },
  ladino: { armaduras: ["leves"], ferramentas: ["ferramentas-ladino"], escolhas: [{ tipo: "pericia", quantidade: 1 }] },
  mago: {},
  monge: { armas: ["simples", "espadas-curtas"] },
  paladino: { armaduras: ["leves", "medias"], armas: ["simples", "marciais"], escudos: true },
  patrulheiro: { armaduras: ["leves", "medias"], armas: ["simples", "marciais"], escudos: true, escolhas: [{ tipo: "pericia", quantidade: 1 }] },
};

export function obterRegraMulticlasse(classeId) {
  return PROFICIENCIAS_MULTICLASSE[classeId] ?? null;
}

export function atendePreRequisitoMulticlasse(classeId, atributos) {
  const requisito = PRE_REQUISITOS_MULTICLASSE[classeId];
  return !requisito || requisito.atende(atributos);
}

export function periciasDisponiveisMulticlasse(periciasAtuais = {}) {
  return PERICIAS.filter((pericia) => !periciasAtuais[pericia.chave]);
}
