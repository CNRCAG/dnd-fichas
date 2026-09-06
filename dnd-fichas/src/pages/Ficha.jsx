import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFichas } from "../context/useFichas";
import { obterRaca } from "../data/racas";
import { obterClasse } from "../data/classes";
import { calcularBonusProficiencia, calcularModificadoresAtributos } from "../utils/dnd";
import { criarEspacosMagiaVazios } from "../utils/magia";
import { calcularCaEquipada } from "../utils/equipamento";
import { obterEspacosPorNivel, mesclarEspacosNoAtual } from "../utils/conjuracao";
import { recalcularPv } from "../utils/progressao";
import { restaurarTodosEspacos, calcularDadosDeVidaRecuperados } from "../utils/descanso";
import BlocoRacaClasse from "../components/ficha/BlocoRacaClasse";
import BlocoAtributos from "../components/ficha/BlocoAtributos";
import BlocoStatus from "../components/ficha/BlocoStatus";
import BlocoAtaques from "../components/ficha/BlocoAtaques";
import BlocoSalvaguardas from "../components/ficha/BlocoSalvaguardas";
import BlocoPericias from "../components/ficha/BlocoPericias";
import BlocoInventario from "../components/ficha/BlocoInventario";
import BlocoMoedas from "../components/ficha/BlocoMoedas";
import BlocoMagias from "../components/ficha/BlocoMagias";
import BlocoHabilidades from "../components/ficha/BlocoHabilidades";
import ModalLevelUp from "../components/modal/ModalLevelUp";
import BlocoDescanso from "../components/ficha/Blocodescanso";
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
  const bonusRacial = raca?.bonusAtributos ?? {};
  const bonusProficiencia = calcularBonusProficiencia(ficha.nivel ?? 1);
  const modificadoresAtributos = calcularModificadoresAtributos(
    ficha.atributos,
    bonusRacial
  );

  function handleChangeAtributo(chave, novoValor) {
    atualizarFicha(id, (ficha) => ({
      atributos: { ...ficha.atributos, [chave]: novoValor },
    }));
  }

  function handleChangeStatus(chave, novoValor) {
    atualizarFicha(id, (ficha) => {
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
    espacosMagia: restaurarTodosEspacos(fichaAtual.espacosMagia ?? {}),
  }));
}

function handleDescansoLongo() {
    atualizarFicha(id, (fichaAtual) => {
      const recuperados = calcularDadosDeVidaRecuperados(fichaAtual.nivel ?? 1);
      return {
        status: { ...fichaAtual.status, pvAtual: fichaAtual.status.pvMax },
        dadosDeVidaUsados: Math.max(0, (fichaAtual.dadosDeVidaUsados ?? 0) - recuperados),
        espacosMagia: restaurarTodosEspacos(fichaAtual.espacosMagia ?? {}),
      };
    });
  }


  function handleChangeRaca(novoRacaId) {
    atualizarFicha(id, () => ({ racaId: novoRacaId }));
  }

  function handleChangeAntecedente(novoAntecedenteId) {
    atualizarFicha(id, () => ({ antecedenteId: novoAntecedenteId }));
  }

  function handleChangeClasse(novoClasseId) {
    atualizarFicha(id, (fichaAtual) => {
      const atualizacoes = { classeId: novoClasseId };
      const novaClasse = obterClasse(novoClasseId);

      const novosTotaisMagia = obterEspacosPorNivel(
        novoClasseId,
        fichaAtual.nivel ?? 1
      );
      atualizacoes.espacosMagia = mesclarEspacosNoAtual(
        fichaAtual.espacosMagia,
        novosTotaisMagia ?? {}
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

      const novosTotaisMagia = obterEspacosPorNivel(classe?.id, novoNivel);
      if (novosTotaisMagia) {
        atualizacoes.espacosMagia = mesclarEspacosNoAtual(
          fichaAtual.espacosMagia,
          novosTotaisMagia
        );
      }

      return atualizacoes;
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

  function chaveArmadurasEquipadas(inventario) {
    return inventario
      .filter((item) => item.tipoItem === "armadura" && item.equipado)
      .map((item) => item.id)
      .sort()
      .join(",");
  }

  function handleChangeInventario(novoInventario) {
    const mudouArmadura =
      chaveArmadurasEquipadas(ficha.inventario ?? []) !==
      chaveArmadurasEquipadas(novoInventario);

    if (mudouArmadura) {
      const novaCa = calcularCaEquipada(
        novoInventario,
        modificadoresAtributos.destreza
      );
      atualizarFicha(id, (fichaAtual) => ({
        inventario: novoInventario,
        status: { ...fichaAtual.status, ca: novaCa },
      }));
    } else {
      atualizarFicha(id, () => ({ inventario: novoInventario }));
    }
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

  function handleChangeNome(evento) {
    const valor = evento.target.value;
    atualizarFicha(id, () => ({ nome: valor || "Sem nome" }));
  }

  function handleChangeCampoTexto(campo, valor) {
    atualizarFicha(id, () => ({ [campo]: valor }));
  }

  function handleConcluirLevelUp(alteracoes) {
    atualizarFicha(id, () => alteracoes);
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
          onChangeRaca={handleChangeRaca}
          onChangeClasse={handleChangeClasse}
          onChangeAntecedente={handleChangeAntecedente}
          onChangeNivel={handleChangeNivel}
        />

        <button
          type="button"
          className="ficha-levelup-botao"
          onClick={() => setModalLevelUpAberto(true)}
          disabled={!classe}
          title={!classe ? "Escolha uma classe primeiro" : undefined}
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
              <BlocoStatus status={ficha.status} onChangeStatus={handleChangeStatus} />
              <BlocoAtaques
                modificadoresAtributos={modificadoresAtributos}
                bonusProficiencia={bonusProficiencia}
                inventario={ficha.inventario ?? []}
                ataques={ficha.ataques ?? []}
                onChangeAtaques={handleChangeAtaques}
              />
              <BlocoDescanso
                classe={classe}
                nivel={ficha.nivel ?? 1}
                modConstituicao={modificadoresAtributos.constituicao}
                status={ficha.status}
                dadosDeVidaUsados={ficha.dadosDeVidaUsados ?? 0}
                onGastarDadoDeVida={handleGastarDadoDeVida}
                onRestaurarEspacosMagia={handleRestaurarEspacosMagia}
                onDescansoLongo={handleDescansoLongo}
              />
              <BlocoSalvaguardas
                modificadoresAtributos={modificadoresAtributos}
                salvaguardasProficientes={classe?.salvaguardasProficientes}
                bonusProficiencia={bonusProficiencia}
              />
            </>
          )}

          {abaAtiva === "habilidades" && (
            <BlocoHabilidades
              classeId={ficha.classeId}
              classeNome={classe?.nome}
              habilidades={ficha.habilidades ?? []}
              onChangeHabilidades={handleChangeHabilidades}
            />
          )}

          {abaAtiva === "pericias" && (
            <BlocoPericias
              modificadoresAtributos={modificadoresAtributos}
              pericias={ficha.pericias ?? {}}
              bonusProficiencia={bonusProficiencia}
              onTogglePericia={handleTogglePericia}
            />
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
              magias={ficha.magias ?? []}
              onChangeMagias={handleChangeMagias}
            />
          )}

          {abaAtiva === "inventario" && (
            <>
              <BlocoInventario
                inventario={ficha.inventario ?? []}
                onChangeInventario={handleChangeInventario}
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
