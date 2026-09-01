import { useState } from "react";
import { PERICIAS } from "../../data/pericias";
import { ATRIBUTOS, formatarModificador } from "../../utils/dnd";
import "./BlocoPericias.css";

export default function BlocoPericias({
  modificadoresAtributos,
  pericias,
  bonusProficiencia,
  onTogglePericia,
}) {
  const [expandidas, setExpandidas] = useState(() => new Set());

  function alternarExpandida(chave) {
    setExpandidas((atual) => {
      const proxima = new Set(atual);
      if (proxima.has(chave)) {
        proxima.delete(chave);
      } else {
        proxima.add(chave);
      }
      return proxima;
    });
  }

  return (
    <section>
      <h3 className="bloco-titulo">Perícias</h3>
      <ul className="pericias-lista">
        {PERICIAS.map((pericia) => {
          const proficiente = Boolean(pericias[pericia.chave]);
          const atributo = ATRIBUTOS.find((a) => a.chave === pericia.atributo);
          const modificadorAtributo = modificadoresAtributos[pericia.atributo];
          const modificador =
            modificadorAtributo + (proficiente ? bonusProficiencia : 0);
          const aberta = expandidas.has(pericia.chave);

          return (
            <li key={pericia.chave} className="pericia-item">
              <div className="pericia-linha">
                <label
                  className="pericia-checkbox-label"
                  onClick={(evento) => evento.stopPropagation()}
                >
                  <input
                    type="checkbox"
                    checked={proficiente}
                    onChange={() => onTogglePericia(pericia.chave)}
                  />
                </label>
                <button
                  type="button"
                  className="pericia-botao-expandir"
                  onClick={() => alternarExpandida(pericia.chave)}
                  aria-expanded={aberta}
                >
                  <span className="pericia-nome">{pericia.label}</span>
                  <span className="pericia-atributo">({atributo?.abreviacao})</span>
                  <span className="pericia-modificador">
                    {formatarModificador(modificador)}
                  </span>
                  <span className={aberta ? "pericia-seta is-aberta" : "pericia-seta"}>
                    ▾
                  </span>
                </button>
              </div>

              {aberta && (
                <div className="pericia-detalhe">
                  <span>
                    Modificador de {atributo?.label}: {formatarModificador(modificadorAtributo)}
                  </span>
                  <span>
                    Bônus de proficiência: {proficiente
                      ? formatarModificador(bonusProficiencia)
                      : "não treinada"}
                  </span>
                </div>
              )}
            </li>
          );
        })}
      </ul>
    </section>
  );
}
