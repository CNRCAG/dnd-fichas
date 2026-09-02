import { RACAS } from "../../data/racas";
import { CLASSES, obterClasse } from "../../data/classes";
import { ATRIBUTOS } from "../../utils/dnd";
import "./BlocoRacaClasse.css";

export default function BlocoRacaClasse({
  racaId,
  classeId,
  nivel,
  onChangeRaca,
  onChangeClasse,
  onChangeNivel,
}) {
  const classe = obterClasse(classeId);
  const labelAtributoPrincipal = classe
    ? ATRIBUTOS.find((a) => a.chave === classe.atributoPrincipal)?.label
    : null;

  return (
    <section>
      <h3 className="bloco-titulo">Raça e classe</h3>
      <div className="raca-classe-grid">
        <label className="raca-classe-campo">
          <span className="raca-classe-label">Raça</span>
          <select
            value={racaId ?? ""}
            onChange={(evento) => onChangeRaca(evento.target.value || null)}
          >
            <option value="">Selecione...</option>
            {RACAS.map((raca) => (
              <option key={raca.id} value={raca.id}>
                {raca.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="raca-classe-campo">
          <span className="raca-classe-label">Classe</span>
          <select
            value={classeId ?? ""}
            onChange={(evento) => onChangeClasse(evento.target.value || null)}
          >
            <option value="">Selecione...</option>
            {CLASSES.map((c) => (
              <option key={c.id} value={c.id}>
                {c.nome}
              </option>
            ))}
          </select>
        </label>

        <label className="raca-classe-campo">
          <span className="raca-classe-label">Nível</span>
          <input
            type="number"
            min="1"
            max="20"
            value={nivel}
            onChange={(evento) =>
              onChangeNivel(Number(evento.target.value) || 1)
            }
          />
        </label>
      </div>

      {classe && (
        <p className="raca-classe-info">
          Dado de vida: d{classe.dadoVida} — Atributo principal: {labelAtributoPrincipal}
        </p>
      )}
    </section>
  );
}
