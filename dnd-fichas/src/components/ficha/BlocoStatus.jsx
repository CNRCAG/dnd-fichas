import "./BlocoStatus.css";

const CAMPOS_STATUS = [
  { chave: "pvAtual", label: "PV atual" },
  { chave: "pvMax", label: "PV máximo" },
  { chave: "ca", label: "Classe de Armadura" },
  { chave: "iniciativa", label: "Iniciativa" },
  { chave: "deslocamento", label: "Deslocamento" },
];

export default function BlocoStatus({ status, onChangeStatus }) {
  function handleChange(chave, evento) {
    const novoValor = Number(evento.target.value);
    onChangeStatus(chave, Number.isNaN(novoValor) ? 0 : novoValor);
  }

  return (
    <section>
      <h3 className="bloco-titulo">Status</h3>
      <div className="bloco-status-grid">
        {CAMPOS_STATUS.map((campo) => (
          <label key={campo.chave} className="status-campo">
            <span className="status-label">{campo.label}</span>
            <input
              type="number"
              className="status-input"
              value={status[campo.chave]}
              onChange={(evento) => handleChange(campo.chave, evento)}
            />
          </label>
        ))}
      </div>
    </section>
  );
}
