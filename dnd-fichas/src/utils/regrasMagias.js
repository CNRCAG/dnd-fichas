import { MAGIAS } from "../data/magiasSistema";
import { classesDaMagia } from "../data/magiasClasses";
import {
  escolhasSegredosMagicos,
  escolhasSegredosMagicosAdicionais,
  regraTrocaMagias,
} from "../data/regrasMagias";
import { nivelMaximoMagiaDaClasse } from "./acessoMagias";

export function dadosDaClasseNaFicha(ficha, classeId) {
  return ficha.classeId === classeId
    ? { classeId, nivel: ficha.nivel ?? 1, subclasseId: ficha.subclasseId ?? null }
    : (ficha.classesSecundarias ?? []).find((classe) => classe.classeId === classeId) ?? null;
}

export function limiteSegredosMagicos(ficha, classeId) {
  const dados = dadosDaClasseNaFicha(ficha, classeId);
  return dados ? escolhasSegredosMagicos(classeId, dados.subclasseId, dados.nivel) : 0;
}

export function contarSegredosMagicos(ficha, classeId) {
  return (ficha.magias ?? []).filter((magia) => magia.origemEspecial?.tipo === "segredos-magicos" && magia.origemEspecial?.classeId === classeId).length;
}

export function limiteSegredosMagicosAdicionais(ficha, classeId) {
  const dados = dadosDaClasseNaFicha(ficha, classeId);
  return dados
    ? escolhasSegredosMagicosAdicionais(dados.subclasseId, dados.nivel)
    : 0;
}

export function magiaElegivelPorSegredo(ficha, classeId, magia) {
  const dados = dadosDaClasseNaFicha(ficha, classeId);
  if (!dados || !magia || Number(magia.nivel) < 0) return false;
  if (Number(magia.nivel) === 0) return true;
  return Number(magia.nivel) <= nivelMaximoMagiaDaClasse(classeId, dados.nivel, dados.subclasseId);
}

export function origemEspecialDaMagia(magia) {
  return magia?.origemEspecial?.tipo ?? (magia?.classeId === "especial" ? "manual" : null);
}

export function validarOrigemEspecial(ficha, magia) {
  const origem = magia?.origemEspecial;
  if (!origem && magia?.classeId !== "especial") return null;
  if ((!origem?.tipo || origem.tipo === "manual" || origem.tipo === "regra-da-mesa") && !magia?.fonteEspecial?.trim()) return { categoria: "pendencia", mensagem: `${magia.nome || "Magia sem nome"}: informe uma origem especial.` };
  if (!origem?.tipo || origem.tipo === "manual" || origem.tipo === "regra-da-mesa") return { categoria: "aviso", mensagem: `${magia.nome || "Magia"}: origem manual/regra da mesa não pode ser conferida automaticamente.` };
  if (origem.tipo === "segredos-magicos") {
    const limite = limiteSegredosMagicos(ficha, origem.classeId);
    if (!limite) return { categoria: "pendencia", mensagem: `${magia.nome}: Segredos Mágicos não está liberado para a classe indicada.` };
    if (!magiaElegivelPorSegredo(ficha, origem.classeId, magia)) return { categoria: "erro", mensagem: `${magia.nome}: círculo acima do permitido para Segredos Mágicos.` };
    if (contarSegredosMagicos(ficha, origem.classeId) > limite) return { categoria: "erro", mensagem: `${origem.classeId}: há mais Segredos Mágicos que escolhas disponíveis.` };
    return null;
  }
  if (origem.tipo === "talento") {
    const talento = (ficha.habilidades ?? []).find((habilidade) => habilidade.tipo === "talento" && habilidade.origemId === origem.fonteId);
    if (!talento) return { categoria: "aviso", mensagem: `${magia.nome}: o talento que concede a magia não está na ficha.` };
    if (origem.fonteId === "iniciado-magia") {
      const classesPermitidas = ["bardo", "bruxo", "clerigo", "druida", "feiticeiro", "mago"];
      if (!classesPermitidas.includes(origem.classeLista)) return { categoria: "pendencia", mensagem: `${magia.nome}: escolha a lista de classe usada por Iniciado em Magia.` };
      if (Number(magia.nivel) > 1 || !classesDaMagia(magia.origemId).includes(origem.classeLista)) return { categoria: "erro", mensagem: `${magia.nome}: não é uma escolha válida de Iniciado em Magia.` };
      const magiasDoTalento = (ficha.magias ?? []).filter((item) => item.origemEspecial?.tipo === "talento" && item.origemEspecial?.fonteId === "iniciado-magia");
      const listasUsadas = new Set(magiasDoTalento.map((item) => item.origemEspecial?.classeLista).filter(Boolean));
      const truques = magiasDoTalento.filter((item) => Number(item.nivel) === 0).length;
      const magiasNivelUm = magiasDoTalento.filter((item) => Number(item.nivel) === 1).length;
      if (listasUsadas.size > 1 || truques > 2 || magiasNivelUm > 1 || magiasDoTalento.some((item) => Number(item.nivel) > 1)) {
        return { categoria: "erro", mensagem: "Iniciado em Magia permite dois truques e uma magia de 1º círculo, todos da mesma lista de classe." };
      }
    }
    return null;
  }
  if (origem.tipo === "item") {
    const item = (ficha.inventario ?? []).find((registro) => registro.id === origem.fonteId || registro.origemId === origem.fonteId);
    return item ? { categoria: "aviso", mensagem: `${magia.nome}: o item ${item.nome} foi relacionado; seus efeitos continuam sob conferência da mesa.` } : { categoria: "aviso", mensagem: `${magia.nome}: o item que concede a magia não existe mais no inventário.` };
  }
  return { categoria: "aviso", mensagem: `${magia.nome}: origem especial não verificável automaticamente.` };
}

export function obterRegraTroca(ficha, classeId, nivel) {
  const dados = dadosDaClasseNaFicha(ficha, classeId);
  return dados ? regraTrocaMagias(classeId, dados.subclasseId, nivel ?? dados.nivel) : null;
}

export function magiasElegiveisParaTroca(ficha, classeId, nivel) {
  const regra = obterRegraTroca(ficha, classeId, nivel);
  if (!regra) return [];
  return (ficha.magias ?? []).filter((magia) => {
    if (Number(magia.nivel) === 0 || magia.origemSubclasseAutomatica) return false;
    const especial = origemEspecialDaMagia(magia);
    if (especial === "segredos-magicos") {
      return magia.origemEspecial?.classeId === classeId && regra.tipos.includes("segredo-magico");
    }
    return magia.classeId === classeId && !especial && regra.tipos.includes("conhecida");
  });
}

export function aplicarTrocasMagias(magias, trocas, classeId) {
  const trocasValidas = new Map(
    (trocas ?? [])
      .filter((troca) => troca?.removidaId && troca?.novaMagiaId)
      .map((troca) => [troca.removidaId, troca.novaMagiaId])
  );

  return (magias ?? []).map((magia) => {
    const novaMagia = MAGIAS.find((item) => item.id === trocasValidas.get(magia.id));
    if (!novaMagia) return magia;
    const segredoMagico = magia.origemEspecial?.tipo === "segredos-magicos";
    return {
      ...magia,
      nome: novaMagia.nome,
      nivel: novaMagia.nivel,
      origemId: novaMagia.id,
      preparada: false,
      fonteEspecial: segredoMagico ? "Segredos Mágicos" : null,
      classeId: segredoMagico ? "especial" : classeId,
      origemEspecial: segredoMagico ? magia.origemEspecial : null,
      origemSubclasseId: null,
      origemSubclasseTipo: null,
      origemSubclasseAutomatica: false,
    };
  });
}

export function encontrarMagiaCatalogo(magia) {
  return MAGIAS.find((item) => item.id === magia?.origemId) ?? MAGIAS.find((item) => item.nome.toLocaleLowerCase() === magia?.nome?.trim().toLocaleLowerCase()) ?? null;
}
