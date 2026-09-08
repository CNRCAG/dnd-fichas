import { useEffect, useState } from "react";
import { ATRIBUTOS, formatarModificador } from "../../utils/dnd";
import { rolarDado } from "../../utils/dados";
import { useRolagem } from "../../context/useRolagem";
import { obterHabilidadesPorClasse } from "../../data/habilidadesClasses";
import { recalcularPv } from "../../utils/progressao";
import { obterClasse } from "../../data/classes";
import DetalheHabilidade from "./DetalheHabilidade";
import "./ModalCatalogoItens.css";
import "./ModalLevelUp.css";

const NIVEIS_ASI = [4, 8, 12, 16, 19];

export default function ModalLevelUp({
  aberto,
  onFechar,
  ficha,
  classe,
  modificadoresAtributos,
  onConcluir,
}) {
  const { registrarRolagem } = useRolagem();
  const [etapa, setEtapa] = useState(0);

  // Todas as classes que dá pra subir: a principal + cada secundária de
  // multiclasse. Cada uma sabe seu próprio dado de vida e nível atual.
  const opcoesClasse = [
    {
      id: classe?.id,
      nome: classe?.nome,
      dadoVida: classe?.dadoVida,
      nivelAtual: ficha.nivel ?? 1,
      ehSecundaria: false,
      indiceSecundaria: null,
    },
    ...(ficha.classesSecundarias ?? [])
      .map((c, indice) => {
        const classeObj = obterClasse(c.classeId);
        return classeObj
          ? {
              id: classeObj.id,
              nome: classeObj.nome,
              dadoVida: classeObj.dadoVida,
              nivelAtual: c.nivel ?? 1,
              ehSecundaria: true,
              indiceSecundaria: indice,
            }
          : null;
      })
      .filter(Boolean),
  ];

  const [classeEscolhidaId, setClasseEscolhidaId] = useState(classe?.id);

  const classeEscolhida =
    opcoesClasse.find((o) => o.id === classeEscolhidaId) ?? opcoesClasse[0];
  const novoNivelDaEscolhida = classeEscolhida.nivelAtual + 1;

  const nivelTotalAtual =
    (ficha.nivel ?? 1) +
    (ficha.classesSecundarias ?? []).reduce((soma, c) => soma + (c.nivel ?? 0), 0);
  const novoNivelTotal = nivelTotalAtual + 1;

  // ---- rascunho das escolhas, só vira de verdade ao "Concluir" ----
  const [metodoPv, setMetodoPv] = useState(null); // "media" | "rolado" | "banked"
  const [ganhoPv, setGanhoPv] = useState(null);
  const [detalheRolagemPv, setDetalheRolagemPv] = useState(null);

  const [modoAsi, setModoAsi] = useState(null); // "duplo" | "unico" | "pular"
  const [atributoAsiUnico, setAtributoAsiUnico] = useState("forca");
  const [atributosAsiDuplo, setAtributosAsiDuplo] = useState(["forca", "destreza"]);

  const [habilidadesSelecionadas, setHabilidadesSelecionadas] = useState(() => new Set());

  // Se esse nível TOTAL já teve o PV definido antes (rolado ou média), não
  // deixa escolher de novo — só reaproveita o valor banked, sem reroll.
  useEffect(() => {
    if (!aberto) return;
    setClasseEscolhidaId(classe?.id);
    const pvBanked = ficha.pvPorNivel?.[novoNivelTotal];
    if (pvBanked != null) {
      setMetodoPv("banked");
      setGanhoPv(pvBanked);
      setDetalheRolagemPv(null);
    } else {
      setMetodoPv(null);
      setGanhoPv(null);
      setDetalheRolagemPv(null);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [aberto, novoNivelTotal, ficha.pvPorNivel, classe?.id]);

  if (!aberto || !classe) return null;

  const chaveAsi = `${classeEscolhida.id}-${novoNivelDaEscolhida}`;
  const temAsi = NIVEIS_ASI.includes(novoNivelDaEscolhida);
  const asiJaAplicado = (ficha.niveisAsiAplicados ?? []).includes(chaveAsi);

  const habilidadesDoNivel = obterHabilidadesPorClasse(classeEscolhida.id).filter(
    (h) => h.nivel === novoNivelDaEscolhida
  );
  const origensHabilidadesJaConcedidas = new Set(
    (ficha.habilidades ?? [])
      .filter((h) => h.tipo === "classe")
      .map((h) => h.origemId)
  );
  const habilidadesNovasDoNivel = habilidadesDoNivel.filter(
    (h) => !origensHabilidadesJaConcedidas.has(h.id)
  );
  const temHabilidades = habilidadesNovasDoNivel.length > 0;

  const etapas = [
    ...(opcoesClasse.length > 1 ? ["escolha-classe"] : []),
    "pv",
    ...(temAsi && !asiJaAplicado ? ["asi"] : []),
    ...(temHabilidades ? ["habilidades"] : []),
    "resumo",
  ];
  const etapaAtual = etapas[etapa];

  function fecharEResetar() {
    setEtapa(0);
    setModoAsi(null);
    setAtributoAsiUnico("forca");
    setAtributosAsiDuplo(["forca", "destreza"]);
    setHabilidadesSelecionadas(new Set());
    onFechar();
  }

  function irProximaEtapa() {
    setEtapa((atual) => Math.min(atual + 1, etapas.length - 1));
  }

  function irEtapaAnterior() {
    setEtapa((atual) => Math.max(atual - 1, 0));
  }

  // ---- PV ----
  const modCon = modificadoresAtributos.constituicao;
  const valorMedia = Math.max(
    1,
    Math.floor(classeEscolhida.dadoVida / 2) + 1 + modCon
  );

  function handleUsarMedia() {
    setMetodoPv("media");
    setGanhoPv(valorMedia);
    setDetalheRolagemPv(null);
  }

  function handleRolarPv() {
    if (detalheRolagemPv) return; // já rolou — não dá pra rerolar
    const dado = rolarDado(classeEscolhida.dadoVida);
    const total = Math.max(1, dado + modCon);
    setMetodoPv("rolado");
    setGanhoPv(total);
    setDetalheRolagemPv({ dado, modCon, total });
    registrarRolagem(
      `Level up: PV (d${classeEscolhida.dadoVida})`,
      {
        formula: `1d${classeEscolhida.dadoVida}+${modCon}`,
        total,
        detalhes: [
          { texto: `1d${classeEscolhida.dadoVida}`, rolagens: [dado], soma: dado },
          { texto: "mod. CON", rolagens: [], soma: modCon },
        ],
      },
      "formula"
    );
  }

  // ---- Habilidades ----
  function alternarHabilidade(id) {
    setHabilidadesSelecionadas((atual) => {
      const proxima = new Set(atual);
      if (proxima.has(id)) {
        proxima.delete(id);
      } else {
        proxima.add(id);
      }
      return proxima;
    });
  }

  // seleciona todas por padrão na primeira vez que a etapa é vista
  if (
    etapaAtual === "habilidades" &&
    habilidadesSelecionadas.size === 0 &&
    habilidadesNovasDoNivel.length > 0
  ) {
    setHabilidadesSelecionadas(new Set(habilidadesNovasDoNivel.map((h) => h.id)));
  }

  // ---- Concluir ----
  function handleConcluir() {
    const novosAtributos = { ...ficha.atributos };
    if (!asiJaAplicado) {
      if (modoAsi === "unico") {
        novosAtributos[atributoAsiUnico] = Math.min(
          20,
          novosAtributos[atributoAsiUnico] + 2
        );
      } else if (modoAsi === "duplo") {
        for (const chave of atributosAsiDuplo) {
          novosAtributos[chave] = Math.min(20, novosAtributos[chave] + 1);
        }
      }
    }

    const novasHabilidades = habilidadesNovasDoNivel
      .filter((h) => habilidadesSelecionadas.has(h.id))
      .map((h) => ({
        id: crypto.randomUUID(),
        nome: h.nome,
        tipo: "classe",
        nivel: h.nivel,
        origemId: h.id,
      }));

    const { pvPorNivel, status } = recalcularPv(
      ficha,
      classe,
      modCon,
      novoNivelTotal,
      { [novoNivelTotal]: ganhoPv ?? 0 }
    );

        const niveisAsiAplicados =
      temAsi && !asiJaAplicado
        ? [...(ficha.niveisAsiAplicados ?? []), chaveAsi]
        : ficha.niveisAsiAplicados ?? [];

    const atualizacoes = {
      pvPorNivel,
      status,
      atributos: novosAtributos,
      niveisAsiAplicados,
            habilidades: [...(ficha.habilidades ?? []), ...novasHabilidades],
    };
    if (classeEscolhida.ehSecundaria) {
      const novasClassesSecundarias = [...(ficha.classesSecundarias ?? [])];
      novasClassesSecundarias[classeEscolhida.indiceSecundaria] = {
        ...novasClassesSecundarias[classeEscolhida.indiceSecundaria],
        nivel: novoNivelDaEscolhida,
      };
      atualizacoes.classesSecundarias = novasClassesSecundarias;
    } else {
      atualizacoes.nivel = novoNivelDaEscolhida;
    }

    onConcluir(atualizacoes);
    fecharEResetar();
  }

  function handleBackdropClick(evento) {
    if (evento.target === evento.currentTarget) fecharEResetar();
  }

  const podeAvancarPv = ganhoPv !== null;
  const podeAvancarAsi =
    modoAsi === "pular" ||
    (modoAsi === "unico" && atributoAsiUnico) ||
    (modoAsi === "duplo" && atributosAsiDuplo[0] !== atributosAsiDuplo[1]);

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div className="modal-catalogo levelup-modal" role="dialog" aria-modal="true" aria-label="Subir de nível">
        <div className="modal-catalogo-cabecalho">
          <h2>
            Subir de Nível — {classeEscolhida.nome} {classeEscolhida.nivelAtual} → {novoNivelDaEscolhida}
          </h2>
          <button type="button" className="modal-catalogo-fechar" onClick={fecharEResetar} aria-label="Fechar">
            ×
          </button>
        </div>

        <div className="levelup-passos">
          {etapas.map((passo, indice) => (
            <span
              key={passo}
              className={indice === etapa ? "levelup-passo is-ativo" : "levelup-passo"}
            />
          ))}
        </div>

        <div className="levelup-corpo">
          {etapaAtual === "escolha-classe" && (
            <div className="levelup-etapa">
              <h3>Qual classe está subindo?</h3>
              <p className="levelup-texto">
                Nível total do personagem: {nivelTotalAtual} → {novoNivelTotal}
              </p>
              <div className="levelup-opcoes-pv">
                {opcoesClasse.map((opcao) => (
                  <button
                    key={opcao.id}
                    type="button"
                    className={
                      classeEscolhidaId === opcao.id
                        ? "levelup-opcao-botao is-selecionado"
                        : "levelup-opcao-botao"
                    }
                    onClick={() => setClasseEscolhidaId(opcao.id)}
                  >
                    {opcao.nome}
                    <span className="levelup-opcao-detalhe">
                      nível {opcao.nivelAtual} → {opcao.nivelAtual + 1}
                    </span>
                  </button>
                ))}
              </div>
            </div>
          )}

          {etapaAtual === "pv" && (
            <div className="levelup-etapa">
              <h3>Pontos de vida</h3>
              <p className="levelup-texto">
                {classeEscolhida.nome} usa dado de vida d{classeEscolhida.dadoVida}.
                Modificador de Constituição: {formatarModificador(modCon)}.
              </p>

              {metodoPv === "banked" ? (
                <p className="levelup-texto">
                  Você já tinha chegado nesse nível total antes — o PV já foi
                  definido como <strong>+{ganhoPv}</strong> e não muda mais
                  (sem reroll).
                </p>
              ) : (
                <div className="levelup-opcoes-pv">
                  <button
                    type="button"
                    className={
                      metodoPv === "media"
                        ? "levelup-opcao-botao is-selecionado"
                        : "levelup-opcao-botao"
                    }
                    onClick={handleUsarMedia}
                  >
                    Usar média
                    <span className="levelup-opcao-detalhe">+{valorMedia} PV</span>
                  </button>
                  <button
                    type="button"
                    className={
                      metodoPv === "rolado"
                        ? "levelup-opcao-botao is-selecionado"
                        : "levelup-opcao-botao"
                    }
                    onClick={handleRolarPv}
                    disabled={detalheRolagemPv !== null}
                  >
                    🎲 Rolar o dado
                    <span className="levelup-opcao-detalhe">
                      {detalheRolagemPv
                        ? `${detalheRolagemPv.dado} + ${detalheRolagemPv.modCon} = +${detalheRolagemPv.total} PV (definitivo)`
                        : `1d${classeEscolhida.dadoVida} + CON`}
                    </span>
                  </button>
                </div>
              )}
            </div>
          )}

          {etapaAtual === "asi" && (
            <div className="levelup-etapa">
              <h3>Melhoria de Atributo (ASI)</h3>
              <p className="levelup-texto">
                {classeEscolhida.nome}, nível {novoNivelDaEscolhida}: você pode aumentar
                atributos ou pular pra pegar um talento depois.
              </p>

              <div className="levelup-opcoes-pv">
                <button
                  type="button"
                  className={
                    modoAsi === "duplo"
                      ? "levelup-opcao-botao is-selecionado"
                      : "levelup-opcao-botao"
                  }
                  onClick={() => setModoAsi("duplo")}
                >
                  +1 em dois atributos
                </button>
                <button
                  type="button"
                  className={
                    modoAsi === "unico"
                      ? "levelup-opcao-botao is-selecionado"
                      : "levelup-opcao-botao"
                  }
                  onClick={() => setModoAsi("unico")}
                >
                  +2 em um atributo
                </button>
                <button
                  type="button"
                  className={
                    modoAsi === "pular"
                      ? "levelup-opcao-botao is-selecionado"
                      : "levelup-opcao-botao"
                  }
                  onClick={() => setModoAsi("pular")}
                >
                  Pular (vou pegar um talento)
                </button>
              </div>

              {modoAsi === "unico" && (
                <select
                  className="levelup-select"
                  value={atributoAsiUnico}
                  onChange={(evento) => setAtributoAsiUnico(evento.target.value)}
                >
                  {ATRIBUTOS.map((a) => (
                    <option key={a.chave} value={a.chave}>
                      {a.label} ({ficha.atributos[a.chave]} → {Math.min(20, ficha.atributos[a.chave] + 2)})
                    </option>
                  ))}
                </select>
              )}

              {modoAsi === "duplo" && (
                <div className="levelup-select-dupla">
                  <select
                    className="levelup-select"
                    value={atributosAsiDuplo[0]}
                    onChange={(evento) =>
                      setAtributosAsiDuplo([evento.target.value, atributosAsiDuplo[1]])
                    }
                  >
                    {ATRIBUTOS.map((a) => (
                      <option key={a.chave} value={a.chave}>
                        {a.label} ({ficha.atributos[a.chave]} → {Math.min(20, ficha.atributos[a.chave] + 1)})
                      </option>
                    ))}
                  </select>
                  <select
                    className="levelup-select"
                    value={atributosAsiDuplo[1]}
                    onChange={(evento) =>
                      setAtributosAsiDuplo([atributosAsiDuplo[0], evento.target.value])
                    }
                  >
                    {ATRIBUTOS.map((a) => (
                      <option key={a.chave} value={a.chave}>
                        {a.label} ({ficha.atributos[a.chave]} → {Math.min(20, ficha.atributos[a.chave] + 1)})
                      </option>
                    ))}
                  </select>
                </div>
              )}
            </div>
          )}

          {etapaAtual === "habilidades" && (
            <div className="levelup-etapa">
              <h3>Novas habilidades de {classeEscolhida.nome}</h3>
              <p className="levelup-texto">
                No nível {novoNivelDaEscolhida}, essa classe ganha isso. Desmarque o que não
                quiser adicionar agora.
              </p>
              <div className="levelup-habilidades-lista">
                {habilidadesNovasDoNivel.map((h) => (
                  <div key={h.id} className="levelup-habilidade-item">
                    <label className="levelup-habilidade-cabecalho">
                      <input
                        type="checkbox"
                        checked={habilidadesSelecionadas.has(h.id)}
                        onChange={() => alternarHabilidade(h.id)}
                      />
                      <span>{h.nome}</span>
                    </label>
                    <DetalheHabilidade item={h} tipo="classe" />
                  </div>
                ))}
              </div>
            </div>
          )}

          {etapaAtual === "resumo" && (
            <div className="levelup-etapa">
              <h3>Resumo</h3>
              <ul className="levelup-resumo-lista">
                <li>
                  {classeEscolhida.nome}: nível {classeEscolhida.nivelAtual} →{" "}
                  <strong>{novoNivelDaEscolhida}</strong>
                </li>
                <li>
                  Nível total do personagem: {nivelTotalAtual} →{" "}
                  <strong>{novoNivelTotal}</strong>
                </li>
                <li>
                  Pontos de vida: <strong>+{ganhoPv ?? 0}</strong> ({ficha.status.pvMax} →{" "}
                  {ficha.status.pvMax + (ganhoPv ?? 0)})
                  {metodoPv === "banked" && " (valor já definido antes, sem reroll)"}
                </li>
                {asiJaAplicado && temAsi && (
                  <li>ASI desse nível já foi escolhido antes — não muda de novo</li>
                )}
                {modoAsi === "unico" && (
                  <li>
                    {ATRIBUTOS.find((a) => a.chave === atributoAsiUnico)?.label}: +2
                  </li>
                )}
                {modoAsi === "duplo" && (
                  <li>
                    {atributosAsiDuplo
                      .map((chave) => ATRIBUTOS.find((a) => a.chave === chave)?.label)
                      .join(" e ")}
                    : +1 cada
                  </li>
                )}
                {modoAsi === "pular" && <li>Sem ASI (lembre de anotar o talento)</li>}
                {temHabilidades && (
                  <li>
                    Habilidades novas: {habilidadesSelecionadas.size} de{" "}
                    {habilidadesNovasDoNivel.length}
                  </li>
                )}
                                <li>Espaços de magia recalculados considerando todas as suas classes</li>
              </ul>
            </div>
          )}
        </div>

        <div className="levelup-navegacao">
          <button
            type="button"
            className="levelup-nav-botao"
            onClick={irEtapaAnterior}
            disabled={etapa === 0}
          >
            Voltar
          </button>
          {etapaAtual === "resumo" ? (
            <button type="button" className="levelup-concluir-botao" onClick={handleConcluir}>
              Concluir level up
            </button>
          ) : (
            <button
              type="button"
              className="levelup-nav-botao is-primario"
              onClick={irProximaEtapa}
              disabled={
                (etapaAtual === "pv" && !podeAvancarPv) ||
                (etapaAtual === "asi" && !podeAvancarAsi)
              }
            >
              Próximo
            </button>
          )}
        </div>
      </div>
    </div>
  );
}