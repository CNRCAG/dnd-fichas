import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { useFichas } from "../context/useFichas";
import { obterRaca } from "../data/racas";
import { obterClasse } from "../data/classes";
import { obterAntecedente } from "../data/antecedentes";
import { obterSubclasse } from "../data/subclasses";
import { obterHabilidadeClasse } from "../data/habilidadesClasses";
import { calcularBonusProficiencia, calcularModificadoresAtributos } from "../utils/dnd";
import { TIPO_CONJURADOR } from "../utils/conjuracao";
import { criarEspacosMagiaVazios } from "../utils/magia";
import { calcularCaEquipada } from "../utils/equipamento";
import {
  obterEspacosCombinadosMulticlasse,
  mesclarEspacosNoAtual,
  mesclarEspacosPacto,
} from "../utils/conjuracao";
import { recalcularPv } from "../utils/progressao";
import { restaurarTodosEspacos, calcularDadosDeVidaRecuperados } from "../utils/descanso";
import { xpParaNivel } from "../utils/xp";
import { calcularCdConcentracao } from "../utils/concentracao"; // NOVO
import { restaurarRecursos } from "../utils/recurso";
import { RECURSOS_CLASSES, resolverUsosMax } from "../data/recursosClasses";
import BlocoRacaClasse from "../components/ficha/BlocoRacaClasse";
import BlocoAtributos from "../components/ficha/BlocoAtributos";
import BlocoStatus from "../components/ficha/BlocoStatus";
import BlocoAtaques from "../components/ficha/BlocoAtaques";
import BlocoSalvaguardas from "../components/ficha/BlocoSalvaguardas";
import BlocoPericias from "../components/ficha/BlocoPericias";
import BlocoProficiencias from "../components/ficha/BlocoProficiencias"; // NOVO
import BlocoInventario from "../components/ficha/BlocoInventario";
import BlocoMoedas from "../components/ficha/BlocoMoedas";
import BlocoMagias from "../components/ficha/BlocoMagias";
import BlocoHabilidades from "../components/ficha/BlocoHabilidades";
import ModalLevelUp from "../components/modal/ModalLevelUp";
import BlocoDescanso from "../components/ficha/BlocoDescanso";
import BlocoRecursos from "../components/ficha/BlocoRecursos";
import BlocoProgressao from "../components/ficha/BlocoProgressao"; // NOVO
import "./Ficha.css";

const ABAS = [
  { chave: "combate", label: "Combate" },
  { chave: "habilidades", label: "Habilidades" },
  { chave: "pericias", label: "Perícias" },
  { chave: "magias", label: "Magias" },
  { chave: "inventario", label: "Inventário" },
  { chave: "notas", label: "Notas" },
];


export default function Ficha() {
  const { id } = useParams();
  const { obterFicha, atualizarFicha } = useFichas();
  const ficha = obterFicha(id);
  const [abaAtiva, setAbaAtiva] = useState("combate");
  const [modalLevelUpAberto, setModalLevelUpAberto] = useState(false);
  const [avisoConcentracao, setAvisoConcentracao] = useState(null); // { cd } | null   NOVO

  if (!ficha) {
    return (
      <div>
        <h2>Ficha não encontrada</h2>
        <p>
          Essa ficha não existe ou foi removida. <Link to="/nova">Crie uma nova</Link>.
        </p>
      </div>
    );
  }

  const raca = obterRaca(ficha.racaId);
  const classe = obterClasse(ficha.classeId);
  function calcularAtualizacoesEspacosMagia(fichaHipotetica) {
  const classesComNiveis = [
    { classeId: fichaHipotetica.classeId, nivel: fichaHipotetica.nivel ?? 1 },
    ...(fichaHipotetica.classesSecundarias ?? []).map((c) => ({
      classeId: c.classeId,
      nivel: c.nivel ?? 1,
    })),
  ].filter((c) => c.classeId);

  const { espacosRegulares, espacosPacto } =
    obterEspacosCombinadosMulticlasse(classesComNiveis);

  return {
    espacosMagia: espacosRegulares
      ? mesclarEspacosNoAtual(fichaHipotetica.espacosMagia, espacosRegulares)
      : fichaHipotetica.espacosMagia,
    espacosMagiaPacto: mesclarEspacosPacto(
      fichaHipotetica.espacosMagiaPacto,
      espacosPacto
    ),
  };
}
const bonusRacial = { ...(raca?.bonusAtributos ?? {}) };
for (const chave of ficha.bonusRacialEscolhido ?? []) {
  if (chave) bonusRacial[chave] = (bonusRacial[chave] ?? 0) + 1;
}
  const forcaTotal = ficha.atributos.forca + (bonusRacial.forca ?? 0);
  const nivelTotal =
    (ficha.nivel ?? 1) +
    (ficha.classesSecundarias ?? []).reduce((soma, c) => soma + (c.nivel ?? 0), 0);
  const bonusProficiencia = calcularBonusProficiencia(nivelTotal);
  const modificadoresAtributos = calcularModificadoresAtributos(
    ficha.atributos,
    bonusRacial
  );

  const modoProgressao = ficha.progressao?.modo ?? "marco";
const xpAtualPersonagem = ficha.progressao?.xpAtual ?? 0;
const xpNecessariaProximoNivel = xpParaNivel(nivelTotal + 1);
const podeSubirPorXp =
  modoProgressao !== "xp" ||
  nivelTotal >= 20 ||
  xpAtualPersonagem >= xpNecessariaProximoNivel;

  const atributosTotais = { ...ficha.atributos };
for (const chave of Object.keys(bonusRacial)) {
  atributosTotais[chave] = (atributosTotais[chave] ?? 0) + bonusRacial[chave];
}

const ehConjurador =
  Boolean(TIPO_CONJURADOR[ficha.classeId]) ||
  (ficha.classesSecundarias ?? []).some((c) => TIPO_CONJURADOR[c.classeId]);

  const percepcaoPassiva =
    10 +
    modificadoresAtributos.sabedoria +
    (ficha.pericias?.percepcao ? bonusProficiencia : 0);
  const investigacaoPassiva =
    10 +
    modificadoresAtributos.inteligencia +
    (ficha.pericias?.investigacao ? bonusProficiencia : 0);

  const caCalculada = calcularCaEquipada(
    ficha.inventario ?? [],
    modificadoresAtributos,
    ficha.classeId
  );

  useEffect(() => {
    if (ficha.status.ca !== caCalculada) {
      atualizarFicha(id, (fichaAtual) => ({
        status: { ...fichaAtual.status, ca: caCalculada },
      }));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [caCalculada]);

  function handleChangeAtributo(chave, novoValor) {
    atualizarFicha(id, (ficha) => ({
      atributos: { ...ficha.atributos, [chave]: novoValor },
    }));
  }

  function handleChangeProgressaoModo(novoModo) {
  atualizarFicha(id, (ficha) => ({
    progressao: { ...ficha.progressao, modo: novoModo },
  }));
}

function handleChangeProgressaoXp(novoXp) {
  atualizarFicha(id, (ficha) => ({
    progressao: { ...ficha.progressao, xpAtual: novoXp },
  }));
}

function handleIniciarConcentracao(magia) {
  atualizarFicha(id, () => ({
    concentracao: { magiaId: magia.id, nome: magia.nome },
  }));
  setAvisoConcentracao(null);
}

function handlePararConcentracao() {
  atualizarFicha(id, () => ({ concentracao: null }));
}

function handleFecharAvisoConcentracao() {
  setAvisoConcentracao(null);
}

  function handleChangeStatus(chave, novoValor) {
  if (chave === "pvAtual" && ficha.concentracao) {
    const danoRecebido = (ficha.status.pvAtual ?? 0) - novoValor;
    if (danoRecebido > 0) {
      setAvisoConcentracao({ cd: calcularCdConcentracao(danoRecebido) });
    }
  }

  atualizarFicha(id, (ficha) => {
    // ...resto continua igual...
      const novoStatus = { ...ficha.status, [chave]: novoValor };

      if (chave === "pvAtual") {
        novoStatus.pvAtual = Math.min(novoValor, novoStatus.pvMax);
        if (novoStatus.pvAtual > 0) {
          novoStatus.testesMorteSucessos = 0;
          novoStatus.testesMorteFalhas = 0;
        }
      }

      if (chave === "pvMax" && novoStatus.pvAtual > novoValor) {
        novoStatus.pvAtual = novoValor;
      }

      return { status: novoStatus };
    });
  }

  function handleChangeRecursos(novosRecursos) {
  atualizarFicha(id, () => ({ recursos: novosRecursos }));
}

function nivelDaClasse(classeIdAlvo) {
  if (classeIdAlvo === ficha.classeId) return ficha.nivel ?? 1;
  return (
    (ficha.classesSecundarias ?? []).find((c) => c.classeId === classeIdAlvo)
      ?.nivel ?? 1
  );
}

const sugestoesRecursos = RECURSOS_CLASSES.filter(
  (r) =>
    r.classeId === ficha.classeId ||
    (ficha.classesSecundarias ?? []).some((c) => c.classeId === r.classeId)
)
    .filter(
    (r) => !(ficha.recursos ?? []).some((existente) => existente.origemId === r.id)
  )
  .map((r) => ({
    ...r,
    usosMaxSugerido: resolverUsosMax(r, {
      nivel: nivelDaClasse(r.classeId),
      modCarisma: modificadoresAtributos.carisma,
    }),
  }));

function handleAdicionarSugestaoRecurso(sugestao) {
  atualizarFicha(id, (fichaAtual) => ({
    recursos: [
      ...(fichaAtual.recursos ?? []),
      {
        id: crypto.randomUUID(),
        nome: sugestao.nome,
        usosMax: sugestao.usosMaxSugerido,
        usosGastos: 0,
        restauraEm: sugestao.restauraEm,
        origemId: sugestao.id,
        origemClasseId: sugestao.classeId,
      },
    ],
  }));
}

  function handleGastarDadoDeVida(cura) {
  atualizarFicha(id, (fichaAtual) => ({
    status: {
      ...fichaAtual.status,
      pvAtual: Math.min(fichaAtual.status.pvMax, fichaAtual.status.pvAtual + cura),
    },
    dadosDeVidaUsados: (fichaAtual.dadosDeVidaUsados ?? 0) + 1,
  }));
}

function handleRestaurarEspacosMagia() {
  atualizarFicha(id, (fichaAtual) => ({
    espacosMagiaPacto: fichaAtual.espacosMagiaPacto
      ? { ...fichaAtual.espacosMagiaPacto, usados: 0 }
      : null,
  }));
}

function handleDescansoLongo() {
  atualizarFicha(id, (fichaAtual) => {
    const recuperados = calcularDadosDeVidaRecuperados(fichaAtual.nivel ?? 1);
    return {
      status: { ...fichaAtual.status, pvAtual: fichaAtual.status.pvMax },
      dadosDeVidaUsados: Math.max(0, (fichaAtual.dadosDeVidaUsados ?? 0) - recuperados),
      espacosMagia: restaurarTodosEspacos(fichaAtual.espacosMagia ?? {}),
      recursos: restaurarRecursos(fichaAtual.recursos ?? [], "longo"),
    };
  });
}

function handleDescansoCurto() {
  atualizarFicha(id, (fichaAtual) => ({
    recursos: restaurarRecursos(fichaAtual.recursos ?? [], "curto"),
  }));
}


function handleChangeRaca(novoRacaId) {
  atualizarFicha(id, () => ({ racaId: novoRacaId, bonusRacialEscolhido: [] }));
}

  function handleChangeAntecedente(novoAntecedenteId) {
  atualizarFicha(id, (fichaAtual) => {
    const periciasAntigas = fichaAtual.periciasDoAntecedente ?? [];
    const novoAntecedente = obterAntecedente(novoAntecedenteId);
    const novasPericiasConcedidas = novoAntecedente?.periciasConcedidas ?? [];

    const periciasAtualizadas = { ...fichaAtual.pericias };
    for (const chave of periciasAntigas) {
      periciasAtualizadas[chave] = false;
    }
    for (const chave of novasPericiasConcedidas) {
      periciasAtualizadas[chave] = true;
    }

    return {
      antecedenteId: novoAntecedenteId,
      pericias: periciasAtualizadas,
      periciasDoAntecedente: novasPericiasConcedidas,
    };
  });
}

  function handleChangeClasse(novoClasseId) {
  atualizarFicha(id, (fichaAtual) => {
            const classeAntigaId = fichaAtual.classeId;
    const atualizacoes = {
      classeId: novoClasseId,
      subclasseId: null,
      habilidades: (fichaAtual.habilidades ?? []).filter((h) => {
        if (h.tipo === "subclasse") return false;
        if (
          h.tipo === "classe" &&
          obterHabilidadeClasse(h.origemId)?.classeId === classeAntigaId
        ) {
          return false;
        }
        return true;
      }),
      recursos: (fichaAtual.recursos ?? []).filter(
        (r) => r.origemClasseId !== classeAntigaId
      ),
    };
    const novaClasse = obterClasse(novoClasseId);

            Object.assign(
        atualizacoes,
        calcularAtualizacoesEspacosMagia({
          ...fichaAtual,
          classeId: novoClasseId,
        })
      );

      if (novaClasse) {
        const modCon = modificadoresAtributos.constituicao;
        const fichaComPvZerado = { ...fichaAtual, pvPorNivel: {} };
        const { pvPorNivel, status } = recalcularPv(
          fichaComPvZerado,
          novaClasse,
          modCon,
          fichaAtual.nivel ?? 1
        );
        atualizacoes.pvPorNivel = pvPorNivel;
        atualizacoes.status = status;
      }

      return atualizacoes;
    });
  }

  function handleChangeNivel(novoNivel) {
    atualizarFicha(id, (fichaAtual) => {
      const atualizacoes = { nivel: novoNivel };

      if (classe) {
        const modCon = modificadoresAtributos.constituicao;
        const { pvPorNivel, status } = recalcularPv(
          fichaAtual,
          classe,
          modCon,
          novoNivel
        );
        atualizacoes.pvPorNivel = pvPorNivel;
        atualizacoes.status = status;
      }

            Object.assign(
        atualizacoes,
        calcularAtualizacoesEspacosMagia({ ...fichaAtual, nivel: novoNivel })
      );

      return atualizacoes;
    });
  }

  function handleChangeSubclasse(novaSubclasseId) {
  atualizarFicha(id, (fichaAtual) => {
    const habilidadesSemSubclasse = (fichaAtual.habilidades ?? []).filter(
      (h) => h.tipo !== "subclasse"
    );
    const subclasse = obterSubclasse(novaSubclasseId);
    const novaHabilidade = subclasse
      ? [
          {
            id: crypto.randomUUID(),
            nome: subclasse.nome,
            tipo: "subclasse",
            nivel: subclasse.nivel,
            origemId: subclasse.id,
          },
        ]
      : [];
    return {
      subclasseId: novaSubclasseId,
      habilidades: [...habilidadesSemSubclasse, ...novaHabilidade],
    };
  });
}

function handleChangeBonusRacialEscolhido(indice, valor) {
  atualizarFicha(id, (fichaAtual) => {
    const atual = [...(fichaAtual.bonusRacialEscolhido ?? [])];
    atual[indice] = valor;
    return { bonusRacialEscolhido: atual };
  });
}

  function handleAdicionarClasseSecundaria() {
  atualizarFicha(id, (fichaAtual) => ({
    classesSecundarias: [
      ...(fichaAtual.classesSecundarias ?? []),
      { classeId: null, nivel: 1 },
    ],
  }));
}

function handleAlterarClasseSecundaria(indice, campo, valor) {
  atualizarFicha(id, (fichaAtual) => {
    const novasClasses = [...(fichaAtual.classesSecundarias ?? [])];
    novasClasses[indice] = { ...novasClasses[indice], [campo]: valor };
    return {
      classesSecundarias: novasClasses,
      ...calcularAtualizacoesEspacosMagia({
        ...fichaAtual,
        classesSecundarias: novasClasses,
      }),
    };
  });
}

function handleRemoverClasseSecundaria(indice) {
  atualizarFicha(id, (fichaAtual) => {
    const novasClasses = (fichaAtual.classesSecundarias ?? []).filter(
      (_, i) => i !== indice
    );
    return {
      classesSecundarias: novasClasses,
      ...calcularAtualizacoesEspacosMagia({
        ...fichaAtual,
        classesSecundarias: novasClasses,
      }),
    };
  });
}

  function handleTogglePericia(chave) {
    atualizarFicha(id, (ficha) => ({
      pericias: {
        ...ficha.pericias,
        [chave]: !ficha.pericias?.[chave],
      },
    }));
  }

  function handleToggleIdioma(idiomaId) {
  atualizarFicha(id, (ficha) => {
    const atuais = ficha.idiomas ?? ["comum"];
    const jaTem = atuais.includes(idiomaId);
    return {
      idiomas: jaTem
        ? atuais.filter((i) => i !== idiomaId)
        : [...atuais, idiomaId],
    };
  });
}

function handleToggleFerramenta(ferramentaId) {
  atualizarFicha(id, (ficha) => {
    const atuais = ficha.proficienciasFerramentas ?? [];
    const jaTem = atuais.includes(ferramentaId);
    return {
      proficienciasFerramentas: jaTem
        ? atuais.filter((f) => f !== ferramentaId)
        : [...atuais, ferramentaId],
    };
  });
}

function handleChangeAtributoFerramenta(ferramentaId, atributoChave) {
  atualizarFicha(id, (ficha) => ({
    atributoFerramentas: { ...ficha.atributoFerramentas, [ferramentaId]: atributoChave },
  }));
}

  function chaveArmadurasEquipadas(inventario) {
    return inventario
      .filter((item) => item.tipoItem === "armadura" && item.equipado)
      .map((item) => item.id)
      .sort()
      .join(",");
  }

  function handleChangeInventario(novoInventario) {
    atualizarFicha(id, () => ({ inventario: novoInventario }));
  }

  function handleChangeMoedas(chave, novoValor) {
    atualizarFicha(id, (ficha) => ({
      moedas: { ...ficha.moedas, [chave]: novoValor },
    }));
  }

  function handleChangeMagias(novasMagias) {
    atualizarFicha(id, () => ({ magias: novasMagias }));
  }

  function handleChangeHabilidades(novasHabilidades) {
    atualizarFicha(id, () => ({ habilidades: novasHabilidades }));
  }

  function handleChangeAtaques(novosAtaques) {
    atualizarFicha(id, () => ({ ataques: novosAtaques }));
  }

  function handleChangeEspacoMagia(nivel, campo, novoValor) {
    atualizarFicha(id, (ficha) => ({
      espacosMagia: {
        ...ficha.espacosMagia,
        [nivel]: { ...ficha.espacosMagia[nivel], [campo]: novoValor },
      },
    }));
  }

  function handleChangeEspacoPacto(novoValor) {
  atualizarFicha(id, (fichaAtual) => ({
    espacosMagiaPacto: { ...fichaAtual.espacosMagiaPacto, usados: novoValor },
  }));
}

  function handleChangeNome(evento) {
    const valor = evento.target.value;
    atualizarFicha(id, () => ({ nome: valor || "Sem nome" }));
  }

  function handleChangeCampoTexto(campo, valor) {
    atualizarFicha(id, () => ({ [campo]: valor }));
  }

  function handleConcluirLevelUp(alteracoes) {
  atualizarFicha(id, (fichaAtual) => {
    const fichaHipotetica = { ...fichaAtual, ...alteracoes };
    return { ...alteracoes, ...calcularAtualizacoesEspacosMagia(fichaHipotetica) };
  });
}

  return (
    <div className="ficha-shell">
      <aside className="ficha-coluna-fixa">
        <input
          type="text"
          className="ficha-nome-input"
          value={ficha.nome}
          onChange={handleChangeNome}
          aria-label="Nome do personagem"
        />

       <BlocoRacaClasse
  racaId={ficha.racaId}
  classeId={ficha.classeId}
  antecedenteId={ficha.antecedenteId}
  nivel={ficha.nivel ?? 1}
  subclasseId={ficha.subclasseId}
  classesSecundarias={ficha.classesSecundarias ?? []}
  bonusRacialEscolhido={ficha.bonusRacialEscolhido ?? []}
  onChangeRaca={handleChangeRaca}
  onChangeClasse={handleChangeClasse}
  onChangeAntecedente={handleChangeAntecedente}
  onChangeNivel={handleChangeNivel}
  onChangeSubclasse={handleChangeSubclasse}
  onAdicionarClasseSecundaria={handleAdicionarClasseSecundaria}
  onAlterarClasseSecundaria={handleAlterarClasseSecundaria}
  onRemoverClasseSecundaria={handleRemoverClasseSecundaria}
  onChangeBonusRacialEscolhido={handleChangeBonusRacialEscolhido}
/>

<BlocoProgressao
  progressao={ficha.progressao ?? { modo: "marco", xpAtual: 0 }}
  nivelTotal={nivelTotal}
  onChangeModo={handleChangeProgressaoModo}
  onChangeXp={handleChangeProgressaoXp}
/>

<button
  type="button"
  className="ficha-levelup-botao"
  onClick={() => setModalLevelUpAberto(true)}
  disabled={!classe || !podeSubirPorXp}
  title={
    !classe
      ? "Escolha uma classe primeiro"
      : !podeSubirPorXp
      ? `Faltam ${xpNecessariaProximoNivel - xpAtualPersonagem} XP para o próximo nível`
      : undefined
  }
>
  ⬆ Subir de Nível
</button>


        <ModalLevelUp
          aberto={modalLevelUpAberto}
          onFechar={() => setModalLevelUpAberto(false)}
          ficha={ficha}
          classe={classe}
          modificadoresAtributos={modificadoresAtributos}
          onConcluir={handleConcluirLevelUp}
        />

        <div className="ficha-stats-rapidas">
          <div className="ficha-stat-rapida">
            <span className="ficha-stat-label">Vida</span>
            <span className="ficha-stat-valor">
              {ficha.status.pvAtual}/{ficha.status.pvMax}
            </span>
          </div>
          <div className="ficha-stat-rapida">
            <span className="ficha-stat-label">Defesa</span>
            <span className="ficha-stat-valor">{ficha.status.ca}</span>
          </div>
        </div>

        <BlocoAtributos
          atributos={ficha.atributos}
          bonusRacial={bonusRacial}
          onChangeAtributo={handleChangeAtributo}
        />
      </aside>

      <div className="ficha-coluna-principal">
        <nav className="ficha-abas">
          {ABAS.map((aba) => (
            <button
              key={aba.chave}
              type="button"
              className={
                abaAtiva === aba.chave ? "ficha-aba is-ativa" : "ficha-aba"
              }
              onClick={() => setAbaAtiva(aba.chave)}
            >
              {aba.label}
            </button>
          ))}
        </nav>

        <div className="ficha-conteudo-aba">
          {abaAtiva === "combate" && (
            <>
              <BlocoStatus
                status={ficha.status}
                onChangeStatus={handleChangeStatus}
                modDestreza={modificadoresAtributos.destreza}
                modConstituicao={modificadoresAtributos.constituicao}
                percepcaoPassiva={percepcaoPassiva}
                investigacaoPassiva={investigacaoPassiva}
                concentracao={ficha.concentracao}
                avisoConcentracao={avisoConcentracao}
                onPararConcentracao={handlePararConcentracao}
                onFecharAvisoConcentracao={handleFecharAvisoConcentracao}
              />
              <BlocoAtaques
                modificadoresAtributos={modificadoresAtributos}
                bonusProficiencia={bonusProficiencia}
                inventario={ficha.inventario ?? []}
                ataques={ficha.ataques ?? []}
                onChangeAtaques={handleChangeAtaques}
              />
              <BlocoDescanso
                classe={classe}
                classesSecundarias={ficha.classesSecundarias ?? []}
                nivel={ficha.nivel ?? 1}
                modConstituicao={modificadoresAtributos.constituicao}
                status={ficha.status}
                dadosDeVidaUsados={ficha.dadosDeVidaUsados ?? 0}
                onGastarDadoDeVida={handleGastarDadoDeVida}
                onRestaurarEspacosMagia={handleRestaurarEspacosMagia}
                onDescansoLongo={handleDescansoLongo}
                onDescansoCurto={handleDescansoCurto}
              />
              <BlocoSalvaguardas
                modificadoresAtributos={modificadoresAtributos}
                salvaguardasProficientes={classe?.salvaguardasProficientes}
                bonusProficiencia={bonusProficiencia}
              />
            </>
          )}

                    {abaAtiva === "habilidades" && (
            <>
              <BlocoHabilidades
                classeId={ficha.classeId}
                classeNome={classe?.nome}
                habilidades={ficha.habilidades ?? []}
                onChangeHabilidades={handleChangeHabilidades}
                atributosTotais={atributosTotais}
                ehConjurador={ehConjurador}
              />
              <BlocoRecursos
  recursos={ficha.recursos ?? []}
  onChangeRecursos={handleChangeRecursos}
  sugestoes={sugestoesRecursos}
  onAdicionarSugestao={handleAdicionarSugestaoRecurso}
/>
            </>
          )}

          {abaAtiva === "pericias" && (
  <>
    <BlocoPericias
      modificadoresAtributos={modificadoresAtributos}
      pericias={ficha.pericias ?? {}}
      bonusProficiencia={bonusProficiencia}
      onTogglePericia={handleTogglePericia}
    />
    <BlocoProficiencias
      idiomas={ficha.idiomas ?? ["comum"]}
      onToggleIdioma={handleToggleIdioma}
      proficienciasFerramentas={ficha.proficienciasFerramentas ?? []}
      onToggleFerramenta={handleToggleFerramenta}
      atributoFerramentas={ficha.atributoFerramentas ?? {}}
      onChangeAtributoFerramenta={handleChangeAtributoFerramenta}
      modificadoresAtributos={modificadoresAtributos}
      bonusProficiencia={bonusProficiencia}
    />
  </>
)}

          {abaAtiva === "magias" && (
            <BlocoMagias
              classe={classe}
              modificadorAtributoPrincipal={
                classe ? modificadoresAtributos[classe.atributoPrincipal] : null
              }
              bonusProficiencia={bonusProficiencia}
              espacosMagia={ficha.espacosMagia ?? criarEspacosMagiaVazios()}
              onChangeEspacoMagia={handleChangeEspacoMagia}
              espacosMagiaPacto={ficha.espacosMagiaPacto}
              onChangeEspacoPacto={handleChangeEspacoPacto}
              magias={ficha.magias ?? []}
              onChangeMagias={handleChangeMagias}   
              concentracaoAtual={ficha.concentracao}
              onIniciarConcentracao={handleIniciarConcentracao}
              onPararConcentracao={handlePararConcentracao}
            />
          )}

          {abaAtiva === "inventario" && (
            <>
              <BlocoInventario
                inventario={ficha.inventario ?? []}
                onChangeInventario={handleChangeInventario}
                forcaTotal={forcaTotal}
              />
              <BlocoMoedas moedas={ficha.moedas ?? {}} onChangeMoedas={handleChangeMoedas} />
            </>
          )}

          {abaAtiva === "notas" && (
            <>
              <section>
                <h3 className="bloco-titulo">Personagem</h3>
                <label className="ficha-campo-texto">
                  <span className="ficha-campo-texto-label">Jogador</span>
                  <input
                    type="text"
                    placeholder="Seu nome"
                    value={ficha.jogador ?? ""}
                    onChange={(evento) =>
                      handleChangeCampoTexto("jogador", evento.target.value)
                    }
                  />
                </label>
                <label className="ficha-campo-texto">
                  <span className="ficha-campo-texto-label">Aparência</span>
                  <textarea
                    className="ficha-notas-textarea ficha-notas-textarea--curta"
                    placeholder="Idade, altura, jeito de se vestir, marcas..."
                    value={ficha.aparencia ?? ""}
                    onChange={(evento) =>
                      handleChangeCampoTexto("aparencia", evento.target.value)
                    }
                  />
                </label>
                <label className="ficha-campo-texto">
                  <span className="ficha-campo-texto-label">Personalidade</span>
                  <textarea
                    className="ficha-notas-textarea ficha-notas-textarea--curta"
                    placeholder="Traços marcantes, opiniões, ideais..."
                    value={ficha.personalidade ?? ""}
                    onChange={(evento) =>
                      handleChangeCampoTexto("personalidade", evento.target.value)
                    }
                  />
                </label>
                <label className="ficha-campo-texto">
                  <span className="ficha-campo-texto-label">Histórico</span>
                  <textarea
                    className="ficha-notas-textarea ficha-notas-textarea--curta"
                    placeholder="Infância, família, como entrou nessa vida..."
                    value={ficha.historico ?? ""}
                    onChange={(evento) =>
                      handleChangeCampoTexto("historico", evento.target.value)
                    }
                  />
                </label>
                <label className="ficha-campo-texto">
                  <span className="ficha-campo-texto-label">Objetivo</span>
                  <textarea
                    className="ficha-notas-textarea ficha-notas-textarea--curta"
                    placeholder="O que motiva esse personagem a aventurar-se?"
                    value={ficha.objetivo ?? ""}
                    onChange={(evento) =>
                      handleChangeCampoTexto("objetivo", evento.target.value)
                    }
                  />
                </label>
              </section>

              <section>
                <h3 className="bloco-titulo">Anotações livres</h3>
                <textarea
                  className="ficha-notas-textarea"
                  placeholder="Qualquer outra coisa: contatos, pistas, itens especiais..."
                  value={ficha.notas ?? ""}
                  onChange={(evento) =>
                    handleChangeCampoTexto("notas", evento.target.value)
                  }
                />
              </section>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
