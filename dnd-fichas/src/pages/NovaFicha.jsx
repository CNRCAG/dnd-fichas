import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useFichas } from "../context/useFichas";
import { RACAS } from "../data/racas";
import { CLASSES } from "../data/classes";
import { ANTECEDENTES } from "../data/antecedentes";
import { ATRIBUTOS, calcularModificador, formatarModificador } from "../utils/dnd";
import { criarEspacosMagiaVazios } from "../utils/magia";
import { obterEspacosPorNivel, mesclarEspacosNoAtual } from "../utils/conjuracao";
import "./NovaFicha.css";

const ETAPAS = [
  { chave: "raca", label: "Raça" },
  { chave: "classe", label: "Classe" },
  { chave: "antecedente", label: "Antecedente" },
  { chave: "atributos", label: "Atributos" },
  { chave: "toques", label: "Toques Finais" },
];

const ARRANJO_PADRAO = [15, 14, 13, 12, 10, 8];

function distribuicaoInicial() {
  const atributos = {};
  ATRIBUTOS.forEach((atributo, indice) => {
    atributos[atributo.chave] = ARRANJO_PADRAO[indice];
  });
  return atributos;
}

export default function NovaFicha() {
  const { criarFicha } = useFichas();
  const navigate = useNavigate();
  const [etapa, setEtapa] = useState(0);
  const [rascunho, setRascunho] = useState(() => ({
    nomePersonagem: "",
    racaId: null,
    classeId: null,
    antecedenteId: null,
    atributos: distribuicaoInicial(),
    jogador: "",
    aparencia: "",
    personalidade: "",
    historico: "",
    objetivo: "",
  }));

  const racaEscolhida = RACAS.find((r) => r.id === rascunho.racaId) ?? null;
  const classeEscolhida = CLASSES.find((c) => c.id === rascunho.classeId) ?? null;
  const antecedenteEscolhido =
    ANTECEDENTES.find((a) => a.id === rascunho.antecedenteId) ?? null;

  function irPara(indice) {
    setEtapa(Math.min(Math.max(indice, 0), ETAPAS.length - 1));
  }

  function handlePular() {
    const novaFicha = criarFicha();
    navigate(`/ficha/${novaFicha.id}`, { replace: true });
  }

  function handleEscolherRaca(id) {
    setRascunho((atual) => ({ ...atual, racaId: id }));
    irPara(etapa + 1);
  }

  function handleEscolherClasse(id) {
    setRascunho((atual) => ({ ...atual, classeId: id }));
    irPara(etapa + 1);
  }

  function handleEscolherAntecedente(id) {
    setRascunho((atual) => ({ ...atual, antecedenteId: id }));
    irPara(etapa + 1);
  }

  function handleChangeAtributoValor(chave, novoValor) {
    setRascunho((atual) => {
      const atributos = { ...atual.atributos };
      const chaveAntiga = Object.keys(atributos).find(
        (k) => atributos[k] === novoValor
      );
      const valorAnterior = atributos[chave];
      if (chaveAntiga && chaveAntiga !== chave) {
        atributos[chaveAntiga] = valorAnterior;
      }
      atributos[chave] = novoValor;
      return { ...atual, atributos };
    });
  }

  function handleChangeCampo(campo, valor) {
    setRascunho((atual) => ({ ...atual, [campo]: valor }));
  }

  function handleFinalizar() {
    const bonusRacial = racaEscolhida?.bonusAtributos ?? {};
    const modCon = calcularModificador(
      rascunho.atributos.constituicao + (bonusRacial.constituicao ?? 0)
    );
    const modDes = calcularModificador(
      rascunho.atributos.destreza + (bonusRacial.destreza ?? 0)
    );
    const pvInicial = classeEscolhida ? classeEscolhida.dadoVida + modCon : 10;

    const periciasIniciais = {};
    antecedenteEscolhido?.periciasConcedidas.forEach((chave) => {
      periciasIniciais[chave] = true;
    });

    const espacosIniciais = classeEscolhida
      ? mesclarEspacosNoAtual(
          criarEspacosMagiaVazios(),
          obterEspacosPorNivel(classeEscolhida.id, 1) ?? {}
        )
      : criarEspacosMagiaVazios();

    const novaFicha = criarFicha(rascunho.nomePersonagem, {
      racaId: rascunho.racaId,
      classeId: rascunho.classeId,
      antecedenteId: rascunho.antecedenteId,
      atributos: rascunho.atributos,
      pericias: periciasIniciais,
      jogador: rascunho.jogador,
      aparencia: rascunho.aparencia,
      personalidade: rascunho.personalidade,
      historico: rascunho.historico,
      objetivo: rascunho.objetivo,
      status: {
        pvAtual: pvInicial,
        pvMax: pvInicial,
        ca: 10 + modDes,
        iniciativa: modDes,
        deslocamento: racaEscolhida?.deslocamento ?? 9,
      },
      pvPorNivel: { 1: pvInicial },
      espacosMagia: espacosIniciais,
    });

    navigate(`/ficha/${novaFicha.id}`, { replace: true });
  }

  return (
    <div className="criacao-shell">
      <button type="button" className="criacao-pular" onClick={handlePular}>
        Pular e criar ficha em branco
      </button>

      <ol className="criacao-passos">
        {ETAPAS.map((info, indice) => (
          <li
            key={info.chave}
            className={
              indice === etapa
                ? "criacao-passo is-ativo"
                : indice < etapa
                ? "criacao-passo is-concluido"
                : "criacao-passo"
            }
          >
            {info.label}
          </li>
        ))}
      </ol>

      <div className="criacao-conteudo">
        {etapa === 0 && (
          <EtapaEscolha
            titulo="Escolha sua Raça"
            texto="A raça define traços físicos, bônus de atributo e alguns talentos naturais do seu personagem."
            itens={RACAS}
            renderExtra={(raca) => (
              <p className="criacao-card-extra">
                {Object.entries(raca.bonusAtributos)
                  .map(
                    ([chave, valor]) =>
                      `${ATRIBUTOS.find((a) => a.chave === chave)?.abreviacao} ${formatarModificador(valor)}`
                  )
                  .join(" · ")}
              </p>
            )}
            onEscolher={handleEscolherRaca}
            onVoltar={null}
            onPular={() => irPara(etapa + 1)}
          />
        )}

        {etapa === 1 && (
          <EtapaEscolha
            titulo="Escolha sua Classe"
            texto="Sua classe é o treinamento e papel do seu personagem no grupo — a característica mais importante em termos de jogo."
            itens={CLASSES}
            renderExtra={(classe) => (
              <p className="criacao-card-extra">
                Dado de vida: d{classe.dadoVida} · Atributo principal:{" "}
                {ATRIBUTOS.find((a) => a.chave === classe.atributoPrincipal)?.label}
              </p>
            )}
            onEscolher={handleEscolherClasse}
            onVoltar={() => irPara(etapa - 1)}
            onPular={() => irPara(etapa + 1)}
          />
        )}

        {etapa === 2 && (
          <EtapaEscolha
            titulo="Escolha seu Antecedente"
            texto="O antecedente representa como a vida do seu personagem era antes da aventura. Concede duas perícias treinadas automaticamente."
            itens={ANTECEDENTES}
            renderExtra={(antecedente) => (
              <p className="criacao-card-extra">
                Perícias: {antecedente.periciasConcedidas.join(", ")} · Equipamento:{" "}
                {antecedente.equipamento}
              </p>
            )}
            onEscolher={handleEscolherAntecedente}
            onVoltar={() => irPara(etapa - 1)}
            onPular={() => irPara(etapa + 1)}
          />
        )}

        {etapa === 3 && (
          <section>
            <h2 className="criacao-titulo">Distribua seus Atributos</h2>
            <p className="criacao-texto">
              Distribua os valores {ARRANJO_PADRAO.join(", ")} entre os seis
              atributos (arranjo padrão — cada valor só pode ser usado uma
              vez). Bônus raciais entram à parte, automaticamente.
            </p>

            <div className="criacao-atributos-grid">
              {ATRIBUTOS.map((atributo) => {
                const bonusRacial = racaEscolhida?.bonusAtributos?.[atributo.chave] ?? 0;
                const valorBase = rascunho.atributos[atributo.chave];
                const valorFinal = valorBase + bonusRacial;
                return (
                  <div key={atributo.chave} className="criacao-atributo-card">
                    <span className="criacao-atributo-label">{atributo.label}</span>
                    <select
                      value={valorBase}
                      onChange={(evento) =>
                        handleChangeAtributoValor(
                          atributo.chave,
                          Number(evento.target.value)
                        )
                      }
                    >
                      {ARRANJO_PADRAO.map((valor) => (
                        <option key={valor} value={valor}>
                          {valor}
                        </option>
                      ))}
                    </select>
                    {bonusRacial !== 0 && (
                      <span className="criacao-atributo-bonus">
                        {formatarModificador(bonusRacial)} racial = {valorFinal}
                      </span>
                    )}
                    <span className="criacao-atributo-modificador">
                      Mod. {formatarModificador(calcularModificador(valorFinal))}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="criacao-navegacao">
              <button type="button" className="criacao-botao-voltar" onClick={() => irPara(etapa - 1)}>
                Voltar
              </button>
              <button type="button" className="criacao-botao-avancar" onClick={() => irPara(etapa + 1)}>
                Próximo
              </button>
            </div>
          </section>
        )}

        {etapa === 4 && (
          <section>
            <h2 className="criacao-titulo">Toques Finais</h2>
            <p className="criacao-texto">
              Até aqui você definiu as características mecânicas da sua
              ficha — mas um bom personagem é mais do que apenas números.
              Esses campos não têm efeito nas regras, mas deixam o jogo mais
              envolvente.
            </p>

            <div className="criacao-toques-grid">
              <label className="criacao-campo">
                <span>Personagem</span>
                <input
                  type="text"
                  placeholder="Nome do personagem"
                  value={rascunho.nomePersonagem}
                  onChange={(evento) =>
                    handleChangeCampo("nomePersonagem", evento.target.value)
                  }
                />
              </label>
              <label className="criacao-campo">
                <span>Jogador</span>
                <input
                  type="text"
                  placeholder="Nome do jogador"
                  value={rascunho.jogador}
                  onChange={(evento) => handleChangeCampo("jogador", evento.target.value)}
                />
              </label>
            </div>

            <label className="criacao-campo">
              <span>Aparência</span>
              <textarea
                placeholder="Idade, altura, jeito de se vestir, marcas..."
                value={rascunho.aparencia}
                onChange={(evento) => handleChangeCampo("aparencia", evento.target.value)}
              />
            </label>

            <label className="criacao-campo">
              <span>Personalidade</span>
              <textarea
                placeholder="Traços marcantes, opiniões, ideais..."
                value={rascunho.personalidade}
                onChange={(evento) =>
                  handleChangeCampo("personalidade", evento.target.value)
                }
              />
            </label>

            <label className="criacao-campo">
              <span>Histórico</span>
              <textarea
                placeholder="Infância, família, como chegou até aqui..."
                value={rascunho.historico}
                onChange={(evento) => handleChangeCampo("historico", evento.target.value)}
              />
            </label>

            <label className="criacao-campo">
              <span>Objetivo</span>
              <textarea
                placeholder="O que motiva esse personagem a se aventurar?"
                value={rascunho.objetivo}
                onChange={(evento) => handleChangeCampo("objetivo", evento.target.value)}
              />
            </label>

            <div className="criacao-navegacao">
              <button type="button" className="criacao-botao-voltar" onClick={() => irPara(etapa - 1)}>
                Voltar
              </button>
              <button type="button" className="criacao-botao-finalizar" onClick={handleFinalizar}>
                Finalizar
              </button>
            </div>
          </section>
        )}
      </div>
    </div>
  );
}

function EtapaEscolha({ titulo, texto, itens, renderExtra, onEscolher, onVoltar, onPular }) {
  return (
    <section>
      <h2 className="criacao-titulo">{titulo}</h2>
      <p className="criacao-texto">{texto}</p>

      <div className="criacao-cards-lista">
        {itens.map((item) => (
          <div key={item.id} className="criacao-card">
            <div className="criacao-card-corpo">
              <h3 className="criacao-card-nome">{item.nome}</h3>
              <p className="criacao-card-descricao">{item.descricao}</p>
              {renderExtra?.(item)}
            </div>
            <button
              type="button"
              className="criacao-card-escolher"
              onClick={() => onEscolher(item.id)}
            >
              Escolher
            </button>
          </div>
        ))}
      </div>

      <div className="criacao-navegacao">
        {onVoltar ? (
          <button type="button" className="criacao-botao-voltar" onClick={onVoltar}>
            Voltar
          </button>
        ) : (
          <span />
        )}
        <button type="button" className="criacao-botao-pular" onClick={onPular}>
          Pular esta etapa →
        </button>
      </div>
    </section>
  );
}
