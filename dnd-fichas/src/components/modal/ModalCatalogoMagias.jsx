import { useMemo, useState } from "react";
import { MAGIAS, ESCOLAS } from "../../data/magiasSistema";
import { CLASSES } from "../../data/classes";
import DetalheMagia from "./DetalheMagia";
import { classesQueAcessamNivel, classesElegiveisParaMagia } from "../../utils/acessoMagias";
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

export default function ModalCatalogoMagias({ aberto, onFechar, onAdicionarMagia, ficha }) {
  const [abaAtiva, setAbaAtiva] = useState(0);
  const [busca, setBusca] = useState("");
  const [expandidos, setExpandidos] = useState(() => new Set());
  const [origens, setOrigens] = useState({});
  const podeAdicionarNivel = (nivel) => classesQueAcessamNivel(ficha, nivel).length > 0;

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
          {!podeAdicionarNivel(abaAtiva) && (
            <p className="modal-catalogo-vazio">
              Nenhuma classe da ficha pode aprender ou preparar magias deste nível ainda.
              Para exceções de talento, item ou regra da mesa, use “Magia personalizada”.
            </p>
          )}
          {magiasFiltradas.length === 0 ? (
            <p className="modal-catalogo-vazio">Nenhuma magia encontrada.</p>
          ) : (
            magiasFiltradas.map((magia) => {
              const expandido = expandidos.has(magia.id);
              const classesElegiveis = classesElegiveisParaMagia(ficha, magia);
              const classeSelecionada = classesElegiveis.some(({ classeId }) => classeId === origens[magia.id])
                ? origens[magia.id]
                : classesElegiveis[0]?.classeId;
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

                  {classesElegiveis.length > 1 && (
                    <select
                      value={classeSelecionada}
                      onChange={(evento) => setOrigens((atual) => ({ ...atual, [magia.id]: evento.target.value }))}
                      aria-label={`Classe de origem de ${magia.nome}`}
                    >
                      {classesElegiveis.map(({ classeId }) => (
                        <option key={classeId} value={classeId}>
                          {CLASSES.find((classe) => classe.id === classeId)?.nome ?? classeId}
                        </option>
                      ))}
                    </select>
                  )}
                  <button
                    type="button"
                    className="item-catalogo-adicionar"
                    onClick={() => onAdicionarMagia(magia, classeSelecionada)}
                    aria-label={`Adicionar ${magia.nome}`}
                    disabled={classesElegiveis.length === 0}
                    title={classesElegiveis.length === 0 ? "Magia fora da lista ou do nível das classes da ficha" : undefined}
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
