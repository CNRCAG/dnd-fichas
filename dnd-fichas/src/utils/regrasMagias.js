import { MAGIAS } from "../data/magiasSistema";
import { classesDaMagia } from "../data/magiasClasses";
import { escolhasSegredosMagicos, regraTrocaMagias } from "../data/regrasMagias";
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

export function magiaElegivelPorSegredo(ficha, classeId, magia) {
  const dados = dadosDaClasseNaFicha(ficha, classeId);
  if (!dados || !magia || Number(magia.nivel) <= 0) return false;
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
    if (!talento) return { categoria: "pendencia", mensagem: `${magia.nome}: o talento que concede a magia não está na ficha.` };
    if (origem.fonteId === "iniciado-magia") {
      if (Number(magia.nivel) > 1 || (origem.classeLista && !classesDaMagia(magia.origemId).includes(origem.classeLista))) return { categoria: "erro", mensagem: `${magia.nome}: não é uma escolha válida de Iniciado em Magia.` };
    }
    return null;
  }
  if (origem.tipo === "item") {
    const item = (ficha.inventario ?? []).find((registro) => registro.id === origem.fonteId);
    return item ? { categoria: "aviso", mensagem: `${magia.nome}: o item ${item.nome} foi relacionado; seus efeitos continuam sob conferência da mesa.` } : { categoria: "pendencia", mensagem: `${magia.nome}: o item que concede a magia não existe mais no inventário.` };
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
    if (magia.classeId !== classeId || Number(magia.nivel) === 0 || magia.origemSubclasseAutomatica) return false;
    const especial = origemEspecialDaMagia(magia);
    return especial === "segredos-magicos" ? regra.tipos.includes("segredo-magico") : !especial && regra.tipos.includes("conhecida");
  });
}

export function encontrarMagiaCatalogo(magia) {
  return MAGIAS.find((item) => item.id === magia?.origemId) ?? MAGIAS.find((item) => item.nome.toLocaleLowerCase() === magia?.nome?.trim().toLocaleLowerCase()) ?? null;
}
