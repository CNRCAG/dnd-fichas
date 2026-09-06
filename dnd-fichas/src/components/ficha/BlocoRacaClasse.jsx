import { useEffect, useState } from "react";
import { RACAS } from "../../data/racas";
import { CLASSES, obterClasse } from "../../data/classes";
import { ANTECEDENTES, obterAntecedente } from "../../data/antecedentes";
import { ATRIBUTOS } from "../../utils/dnd";
import "./BlocoRacaClasse.css";

export default function BlocoRacaClasse({
  racaId,
  classeId,
  antecedenteId,
  nivel,
  onChangeRaca,
  onChangeClasse,
  onChangeAntecedente,
  onChangeNivel,
}) {
  const classe = obterClasse(classeId);
  const antecedente = obterAntecedente(antecedenteId);
  const labelAtributoPrincipal = classe
    ? ATRIBUTOS.find((a) => a.chave === classe.atributoPrincipal)?.label
    : null;

  // Rascunho local do nível: só confirma (e dispara PV/slots automáticos)
  // ao sair do campo — digitar "15" por cima de "3" não deve passar por
  // um "1" intermediário e conceder PV de nível perdido no caminho.
  const [nivelRascunho, setNivelRascunho] = useState(String(nivel));

  useEffect(() => {
    setNivelRascunho(String(nivel));
  }, [nivel]);

  function confirmarNivel() {
    const numero = Math.min(20, Math.max(1, Number(nivelRascunho) || 1));
    setNivelRascunho(String(numero));
    if (numero !== nivel) onChangeNivel(numero);
  }

  function handleKeyDownNivel(evento) {
    if (evento.key === "Enter") evento.currentTarget.blur();
  }

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
            value={nivelRascunho}
            onChange={(evento) => setNivelRascunho(evento.target.value)}
            onBlur={confirmarNivel}
            onKeyDown={handleKeyDownNivel}
          />
        </label>

        <label className="raca-classe-campo raca-classe-campo--largo">
          <span className="raca-classe-label">Antecedente</span>
          <select
            value={antecedenteId ?? ""}
            onChange={(evento) =>
              onChangeAntecedente(evento.target.value || null)
            }
          >
            <option value="">Selecione...</option>
            {ANTECEDENTES.map((antecedente) => (
              <option key={antecedente.id} value={antecedente.id}>
                {antecedente.nome}
              </option>
            ))}
          </select>
        </label>
      </div>

      {classe && (
        <p className="raca-classe-info">
          Dado de vida: d{classe.dadoVida} — Atributo principal: {labelAtributoPrincipal}
        </p>
      )}
      {antecedente && (
        <p className="raca-classe-info">
          {antecedente.caracteristica.nome}: {antecedente.caracteristica.descricao}
        </p>
      )}
    </section>
  );
}
