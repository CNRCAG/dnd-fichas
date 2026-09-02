import { useMemo, useState } from "react";
import { MAGIAS, ESCOLAS } from "../../data/magiasSistema";
import DetalheMagia from "./DetalheMagia";
import "./ModalCatalogoItens.css";

const NIVEIS_ABA = [
  { valor: 0, label: "Truque" },
  { valor: 1, label: "1º" },
  { valor: 2, label: "2º" },
  { valor: 3, label: "3º" },
  { valor: 4, label: "4º" },
  { valor: 5, label: "5º" },
  { valor: 6, label: "6º" },
  { valor: 7, label: "7º" },
  { valor: 8, label: "8º" },
  { valor: 9, label: "9º" },
];

export default function ModalCatalogoMagias({ aberto, onFechar, onAdicionarMagia }) {
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [busca, setBusca] = useState("");
  const [expandidos, setExpandidos] = useState(() => new Set());

  const magiasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    return MAGIAS.filter((magia) => {
      const bateNivel = magia.nivel === abaAtiva;
      const bateBusca = !termo || magia.nome.toLowerCase().includes(termo);
      return bateNivel && bateBusca;
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
      <div className="modal-catalogo" role="dialog" aria-modal="true" aria-label="Adicionar magias">
        <div className="modal-catalogo-cabecalho">
          <h2>Adicionar Magias</h2>
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
          {NIVEIS_ABA.map((nivel) => (
            <button
              key={nivel.valor}
              type="button"
              className={
                abaAtiva === nivel.valor
                  ? "modal-catalogo-aba is-ativa"
                  : "modal-catalogo-aba"
              }
              onClick={() => setAbaAtiva(nivel.valor)}
            >
              {nivel.label}
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
          {magiasFiltradas.length === 0 ? (
            <p className="modal-catalogo-vazio">Nenhuma magia encontrada.</p>
          ) : (
            magiasFiltradas.map((magia) => {
              const expandido = expandidos.has(magia.id);
              return (
                <div key={magia.id} className="item-catalogo">
                  <button
                    type="button"
                    className="item-catalogo-cabecalho"
                    onClick={() => alternarExpandido(magia.id)}
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
                    <span className="item-catalogo-nome">{magia.nome}</span>
                    <span className="item-catalogo-resumo">
                      {ESCOLAS[magia.escola] ?? magia.escola}
                      {magia.concentracao ? " • Conc." : ""}
                      {magia.ritual ? " • Ritual" : ""}
                    </span>
                  </button>

                  <button
                    type="button"
                    className="item-catalogo-adicionar"
                    onClick={() => onAdicionarMagia(magia)}
                    aria-label={`Adicionar ${magia.nome}`}
                  >
                    +
                  </button>

                  {expandido && (
                    <div className="item-catalogo-corpo">
                      <DetalheMagia magia={magia} />
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
