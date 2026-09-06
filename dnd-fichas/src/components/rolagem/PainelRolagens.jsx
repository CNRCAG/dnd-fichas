import { useState } from "react";
import { useRolagem } from "../../context/useRolagem";
import "./PainelRolagens.css";

function ResumoD20({ resultado }) {
  const critico = resultado.d20 === 20;
  const desastre = resultado.d20 === 1;
  return (
    <span
      className={
        critico
          ? "rolagem-total is-critico"
          : desastre
          ? "rolagem-total is-desastre"
          : "rolagem-total"
      }
    >
      {resultado.total}
    </span>
  );
}

function DetalheRolagem({ rolagem }) {
  const { tipo, resultado } = rolagem;

  if (tipo === "d20") {
    const critico = resultado.d20 === 20;
    const desastre = resultado.d20 === 1;
    return (
      <p className="rolagem-detalhe-texto">
        d20:{" "}
        <span
          className={
            critico ? "is-critico" : desastre ? "is-desastre" : ""
          }
        >
          {resultado.d20}
        </span>{" "}
        {resultado.modificador >= 0 ? "+" : ""}
        {resultado.modificador} = <strong>{resultado.total}</strong>
      </p>
    );
  }

  return (
    <p className="rolagem-detalhe-texto">
      {resultado.detalhes
        .map((d) =>
          d.rolagens.length > 0
            ? `${d.texto} [${d.rolagens.join(", ")}]`
            : d.texto
        )
        .join(" + ")}{" "}
      = <strong>{resultado.total}</strong>
    </p>
  );
}

export default function PainelRolagens() {
  const { rolagens, limparHistorico } = useRolagem();
  const [expandido, setExpandido] = useState(false);

  if (rolagens.length === 0) return null;

  const ultima = rolagens[0];

  return (
    <div className={expandido ? "painel-rolagens is-expandido" : "painel-rolagens"}>
      <button
        type="button"
        className="painel-rolagens-toggle"
        onClick={() => setExpandido((atual) => !atual)}
      >
        <span className="painel-rolagens-icone" aria-hidden="true">
          🎲
        </span>
        <span className="painel-rolagens-titulo">{ultima.titulo}</span>
        {ultima.tipo === "d20" ? (
          <ResumoD20 resultado={ultima.resultado} />
        ) : (
          <span className="rolagem-total">{ultima.resultado.total}</span>
        )}
      </button>

      {expandido && (
        <div className="painel-rolagens-lista">
          {rolagens.map((rolagem) => (
            <div key={rolagem.id} className="item-rolagem">
              <div className="item-rolagem-cabecalho">
                <span className="item-rolagem-titulo">{rolagem.titulo}</span>
              </div>
              <DetalheRolagem rolagem={rolagem} />
            </div>
          ))}
          <button
            type="button"
            className="painel-rolagens-limpar"
            onClick={limparHistorico}
          >
            Limpar histórico
          </button>
        </div>
      )}
    </div>
  );
}
