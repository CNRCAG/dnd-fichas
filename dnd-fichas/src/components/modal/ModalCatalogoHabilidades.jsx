import { useMemo, useState } from "react";
import { obterHabilidadesPorClasse } from "../../data/habilidadesClasses";
import { TALENTOS } from "../../data/talentos";
import DetalheHabilidade from "./DetalheHabilidade";
import "./ModalCatalogoItens.css";

export default function ModalCatalogoHabilidades({
  aberto,
  onFechar,
  onAdicionarHabilidade,
  classeId,
  classeNome,
}) {
  const [abaAtiva, setAbaAtiva] = useState("classe");
  const [busca, setBusca] = useState("");
  const [expandidos, setExpandidos] = useState(() => new Set());

  const habilidadesClasse = useMemo(
    () => (classeId ? obterHabilidadesPorClasse(classeId) : []),
    [classeId]
  );

  const listaAtual = abaAtiva === "classe" ? habilidadesClasse : TALENTOS;

  const listaFiltrada = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return listaAtual;
    return listaAtual.filter((item) => item.nome.toLowerCase().includes(termo));
  }, [listaAtual, busca]);

  if (!aberto) return null;

  function alternarExpandido(id) {
    setExpandidos((atual) => {
      const novo = new Set(atual);
      if (novo.has(id)) {
        novo.delete(id);
      } else {
        novo.add(id);
      }
      return novo;
    });
  }

  function handleBackdropClick(evento) {
    if (evento.target === evento.currentTarget) onFechar();
  }

  return (
    <div className="modal-backdrop" onClick={handleBackdropClick}>
      <div
        className="modal-catalogo"
        role="dialog"
        aria-modal="true"
        aria-label="Adicionar habilidades e talentos"
      >
        <div className="modal-catalogo-cabecalho">
          <h2>Adicionar Habilidade</h2>
          <button
            type="button"
            className="modal-catalogo-fechar"
            onClick={onFechar}
            aria-label="Fechar"
          >
            ×
          </button>
        </div>

        <div className="modal-catalogo-abas">
          <button
            type="button"
            className={
              abaAtiva === "classe"
                ? "modal-catalogo-aba is-ativa"
                : "modal-catalogo-aba"
            }
            onClick={() => setAbaAtiva("classe")}
          >
            {classeNome ?? "Sua classe"}
          </button>
          <button
            type="button"
            className={
              abaAtiva === "talento"
                ? "modal-catalogo-aba is-ativa"
                : "modal-catalogo-aba"
            }
            onClick={() => setAbaAtiva("talento")}
          >
            Talentos
          </button>
        </div>

        <input
          type="text"
          className="modal-catalogo-busca"
          placeholder="Buscar..."
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />

        <div className="modal-catalogo-lista">
          {abaAtiva === "classe" && !classeId ? (
            <p className="modal-catalogo-vazio">
              Escolha uma classe na ficha primeiro pra ver as habilidades dela
              aqui.
            </p>
          ) : listaFiltrada.length === 0 ? (
            <p className="modal-catalogo-vazio">Nada encontrado.</p>
          ) : (
            listaFiltrada.map((item) => {
              const expandido = expandidos.has(item.id);
              return (
                <div key={item.id} className="item-catalogo">
                  <button
                    type="button"
                    className="item-catalogo-cabecalho"
                    onClick={() => alternarExpandido(item.id)}
                    aria-expanded={expandido}
                  >
                    <span
                      className={
                        expandido
                          ? "item-catalogo-seta is-aberta"
                          : "item-catalogo-seta"
                      }
                      aria-hidden="true"
                    >
                      ▾
                    </span>
                    <span className="item-catalogo-nome">{item.nome}</span>
                    <span className="item-catalogo-resumo">
                      {abaAtiva === "classe" ? `Nível ${item.nivel}` : "Talento"}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="item-catalogo-adicionar"
                    onClick={() => onAdicionarHabilidade(item, abaAtiva)}
                    aria-label={`Adicionar ${item.nome}`}
                  >
                    +
                  </button>

                  {expandido && (
                    <div className="item-catalogo-corpo">
                      <DetalheHabilidade item={item} tipo={abaAtiva} />
                    </div>
                  )}
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
