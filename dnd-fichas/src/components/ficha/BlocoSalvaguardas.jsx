import { ATRIBUTOS, formatarModificador } from "../../utils/dnd";
import { rolarTesteD20 } from "../../utils/dados";
import { useRolagem } from "../../context/useRolagem";
import "./BlocoSalvaguardas.css";

export default function BlocoSalvaguardas({
  modificadoresAtributos,
  salvaguardasProficientes,
  bonusProficiencia,
}) {
  const { registrarRolagem } = useRolagem();

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

          function handleRolar() {
            const resultado = rolarTesteD20(modificador);
            registrarRolagem(`Salvaguarda: ${atributo.label}`, resultado, "d20");
          }

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
              <button
                type="button"
                className="salvaguarda-modificador-botao"
                onClick={handleRolar}
                title={`Rolar salvaguarda de ${atributo.label} (d20${formatarModificador(modificador)})`}
              >
                🎲 {formatarModificador(modificador)}
              </button>
            </li>
          );
        })}
      </ul>
    </section>
  );
}
