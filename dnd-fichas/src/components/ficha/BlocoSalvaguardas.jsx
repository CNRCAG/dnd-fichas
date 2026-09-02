import { ATRIBUTOS, formatarModificador } from "../../utils/dnd";
import "./BlocoSalvaguardas.css";

export default function BlocoSalvaguardas({
  modificadoresAtributos,
  salvaguardasProficientes,
  bonusProficiencia,
}) {
  return (
    <section>
      <h3 className="bloco-titulo">Salvaguardas</h3>
      {!salvaguardasProficientes && (
        <p className="salvaguardas-aviso">
          Escolha uma classe para ver as salvaguardas proficientes.
        </p>
      )}
      <ul className="salvaguardas-lista">
        {ATRIBUTOS.map((atributo) => {
          const proficiente = salvaguardasProficientes?.includes(
            atributo.chave
          );
          const modificador =
            modificadoresAtributos[atributo.chave] +
            (proficiente ? bonusProficiencia : 0);

          return (
            <li key={atributo.chave} className="salvaguarda-item">
              <span
                className={
                  proficiente
                    ? "salvaguarda-marcador is-proficiente"
                    : "salvaguarda-marcador"
                }
                aria-hidden="true"
              />
              <span className="salvaguarda-label">{atributo.label}</span>
              <span className="salvaguarda-modificador">
                {formatarModificador(modificador)}
              </span>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
