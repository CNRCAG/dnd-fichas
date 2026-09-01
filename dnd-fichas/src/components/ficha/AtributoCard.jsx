import { calcularModificador, formatarModificador } from "../../utils/dnd";
import "./AtributoCard.css";

export default function AtributoCard({
  label,
  abreviacao,
  valor,
  bonusRacial = 0,
  onChange,
}) {
  const total = valor + bonusRacial;
  const modificador = calcularModificador(total);

  function handleChange(evento) {
    const novoValor = Number(evento.target.value);
    onChange(Number.isNaN(novoValor) ? 0 : novoValor);
  }

  return (
    <div className="atributo-card">
      <span className="atributo-label">{label}</span>
      <input
        className="atributo-input"
        type="number"
        min="1"
        max="30"
        value={valor}
        onChange={handleChange}
        aria-label={`Valor base de ${label}`}
      />
      {bonusRacial !== 0 && (
        <span className="atributo-bonus">
          {formatarModificador(bonusRacial)} racial &rarr; total {total}
        </span>
      )}
      <span className="atributo-modificador">
        {formatarModificador(modificador)}
      </span>
      <span className="atributo-abreviacao">{abreviacao}</span>
    </div>
  );
}
