import { useMemo, useState } from "react";
import { CATALOGO_ITENS } from "../../data/catalogoItens";
import DetalheItemCatalogo from "./DetalheItemCatalogo";
import "./ModalCatalogoItens.css";

const GRUPOS = ["Armas", "Armaduras", "Equipamentos"];

export default function ModalCatalogoItens({ aberto, onFechar, onAdicionarItem }) {
  const [abaAtiva, setAbaAtiva] = useState("Armas");
  const [busca, setBusca] = useState("");
  const [expandidos, setExpandidos] = useState(() => new Set());

  const itensFiltrados = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return CATALOGO_ITENS.filter((item) => {
      const bateGrupo = item.grupo === abaAtiva;
      const bateBusca = !termo || item.nome.toLowerCase().includes(termo);
      return bateGrupo && bateBusca;
    });
  }, [abaAtiva, busca]);

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
      <div className="modal-catalogo" role="dialog" aria-modal="true" aria-label="Adicionar itens">
        <div className="modal-catalogo-cabecalho">
          <h2>Adicionar Itens</h2>
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
          {GRUPOS.map((grupo) => (
            <button
              key={grupo}
              type="button"
              className={
                abaAtiva === grupo
                  ? "modal-catalogo-aba is-ativa"
                  : "modal-catalogo-aba"
              }
              onClick={() => setAbaAtiva(grupo)}
            >
              {grupo}
            </button>
          ))}
        </div>

        <input
          type="text"
          className="modal-catalogo-busca"
          placeholder="Buscar..."
          value={busca}
          onChange={(evento) => setBusca(evento.target.value)}
        />

        <div className="modal-catalogo-lista">
          {itensFiltrados.length === 0 ? (
            <p className="modal-catalogo-vazio">Nenhum item encontrado.</p>
          ) : (
            itensFiltrados.map((item) => {
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
                    <span className="item-catalogo-resumo">{item.resumo}</span>
                  </button>

                  <button
                    type="button"
                    className="item-catalogo-adicionar"
                    onClick={() => onAdicionarItem(item)}
                    aria-label={`Adicionar ${item.nome}`}
                  >
                    +
                  </button>

                  {expandido && (
                    <div className="item-catalogo-corpo">
                      <DetalheItemCatalogo item={item} />
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
