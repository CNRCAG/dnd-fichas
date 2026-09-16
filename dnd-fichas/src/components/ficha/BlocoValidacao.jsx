import { useMemo } from "react";
import { validarFicha } from "../../utils/validacaoFicha";
import "./BlocoValidacao.css";

export default function BlocoValidacao({ ficha, atributosTotais }) {
  const { erros, avisos, pronta } = useMemo(
    () => validarFicha(ficha, atributosTotais),
    [ficha, atributosTotais]
  );

  return (
    <section className={pronta ? "validacao-ficha is-pronta" : "validacao-ficha"} aria-live="polite">
      <div className="validacao-cabecalho">
        <h3 className="bloco-titulo">Validação da ficha</h3>
        <span className="validacao-status">
          {pronta ? "Pronta para a mesa" : `${erros.length} pendência${erros.length === 1 ? "" : "s"}`}
        </span>
      </div>

      {pronta ? (
        <p className="validacao-texto">
          Os requisitos básicos e os limites automáticos estão consistentes.
        </p>
      ) : (
        <ul className="validacao-lista validacao-lista--erros">
          {erros.map((erro, indice) => (
            <li key={`${erro}-${indice}`}>{erro}</li>
          ))}
        </ul>
      )}

      {avisos.length > 0 && (
        <>
          <p className="validacao-aviso-titulo">Confira também</p>
          <ul className="validacao-lista validacao-lista--avisos">
            {avisos.map((aviso, indice) => (
              <li key={`${aviso}-${indice}`}>{aviso}</li>
            ))}
          </ul>
        </>
      )}
    </section>
  );
}
