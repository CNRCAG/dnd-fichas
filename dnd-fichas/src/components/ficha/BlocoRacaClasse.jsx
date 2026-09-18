import { useState } from "react";
import { RACAS } from "../../data/racas";
import { CLASSES, obterClasse } from "../../data/classes";
import {
  obterSubclassesPorClasse,
  obterNivelEscolhaSubclasse,
} from "../../data/subclasses";
import { ANTECEDENTES, obterAntecedente } from "../../data/antecedentes";
import { ATRIBUTOS } from "../../utils/dnd";
import "./BlocoRacaClasse.css";

function CampoNivel({ nivel, nivelMaximo, onChangeNivel }) {
  const [nivelRascunho, setNivelRascunho] = useState(String(nivel));

  function confirmarNivel() {
    const numero = Math.min(
      nivelMaximo,
      Math.max(1, Number(nivelRascunho) || 1)
    );
    setNivelRascunho(String(numero));
    if (numero !== nivel) onChangeNivel(numero);
  }

  function handleKeyDown(evento) {
    if (evento.key === "Enter") evento.currentTarget.blur();
  }

  return (
    <input
      type="number"
      min="1"
      max={nivelMaximo}
      value={nivelRascunho}
      onChange={(evento) => setNivelRascunho(evento.target.value)}
      onBlur={confirmarNivel}
      onKeyDown={handleKeyDown}
    />
  );
}

export default function BlocoRacaClasse({
  racaId,
  classeId,
  antecedenteId,
  nivel,
  nivelTotal,
  nivelMaximoPrincipal,
  subclasseId,
  classesSecundarias,
  bonusRacialEscolhido,
  onChangeRaca,
  onChangeClasse,
  onChangeAntecedente,
  onChangeNivel,
  onChangeSubclasse,
  onAdicionarClasseSecundaria,
  onAlterarClasseSecundaria,
  onRemoverClasseSecundaria,
  onChangeBonusRacialEscolhido,
}) {
  const racaSelecionada = RACAS.find((r) => r.id === racaId);
  const subclassesDisponiveis = obterSubclassesPorClasse(classeId);
  const nivelEscolhaSubclasse = obterNivelEscolhaSubclasse(classeId);
  const podeEscolherSubclasse = nivel >= (nivelEscolhaSubclasse ?? Infinity);
  const classe = obterClasse(classeId);
  const antecedente = obterAntecedente(antecedenteId);
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

        {racaSelecionada?.atributosEscolhaLivre && (
          <div className="raca-classe-campo raca-classe-campo--largo">
            <span className="raca-classe-label">
              Escolha {racaSelecionada.atributosEscolhaLivre} atributos pra +1 cada
            </span>
            <div className="raca-escolha-livre-selects">
              {Array.from({ length: racaSelecionada.atributosEscolhaLivre }).map(
                (_, indice) => {
                  const outrosEscolhidos = (bonusRacialEscolhido ?? []).filter(
                    (_, i) => i !== indice
                  );
                  return (
                    <select
                      key={indice}
                      value={bonusRacialEscolhido?.[indice] ?? ""}
                      onChange={(evento) =>
                        onChangeBonusRacialEscolhido(indice, evento.target.value)
                      }
                    >
                      <option value="">Selecione...</option>
                      {ATRIBUTOS.filter(
                        (a) =>
                          !racaSelecionada.bonusAtributos?.[a.chave] &&
                          !outrosEscolhidos.includes(a.chave)
                      ).map((a) => (
                        <option key={a.chave} value={a.chave}>
                          {a.label}
                        </option>
                      ))}
                    </select>
                  );
                }
              )}
            </div>
          </div>
        )}

            

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

        {classeId && (
          <label className="raca-classe-campo">
            <span className="raca-classe-label">Subclasse</span>
            <select
              value={subclasseId ?? ""}
              onChange={(evento) => onChangeSubclasse(evento.target.value || null)}
              disabled={!podeEscolherSubclasse}
            >
              <option value="">
                {podeEscolherSubclasse
                  ? "Selecione..."
                  : `Disponível no nível ${nivelEscolhaSubclasse}`}
              </option>
              {subclassesDisponiveis.map((s) => (
                <option key={s.id} value={s.id}>
                  {s.nome}
                </option>
              ))}
            </select>
          </label>
        )}
        <label className="raca-classe-campo">
          <span className="raca-classe-label">Nível</span>
          <CampoNivel
            key={nivel}
            nivel={nivel}
            nivelMaximo={nivelMaximoPrincipal}
            onChangeNivel={onChangeNivel}
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

      {classeId && (
        <div className="multiclasse-bloco">
          <span className="raca-classe-label">Classes secundárias (multiclasse)</span>
          <p className="multiclasse-limite">Nível total: {nivelTotal}/20</p>
          {(classesSecundarias ?? []).map((c, indice) => (
            <div key={indice} className="multiclasse-linha">
              <select
                value={c.classeId ?? ""}
                onChange={(evento) =>
                  onAlterarClasseSecundaria(indice, "classeId", evento.target.value)
                }
              >
                <option value="">Selecione...</option>
                {CLASSES.filter((classeItem) => classeItem.id !== classeId).map(
                  (classeItem) => (
                    <option key={classeItem.id} value={classeItem.id}>
                      {classeItem.nome}
                    </option>
                  )
                )}
              </select>
              <input
                type="number"
                min="1"
                max={Math.max(1, 20 - (nivelTotal - (Number(c.nivel) || 1)))}
                className="multiclasse-nivel"
                value={c.nivel}
                onChange={(evento) =>
                  onAlterarClasseSecundaria(
                    indice,
                    "nivel",
                    Math.max(1, Number(evento.target.value) || 1)
                  )
                }
              />
              <select
                value={c.subclasseId ?? ""}
                disabled={
                  !c.classeId ||
                  Number(c.nivel) < (obterNivelEscolhaSubclasse(c.classeId) ?? Infinity)
                }
                onChange={(evento) =>
                  onAlterarClasseSecundaria(
                    indice,
                    "subclasseId",
                    evento.target.value || null
                  )
                }
                aria-label={`Subclasse de ${
                  CLASSES.find((classeItem) => classeItem.id === c.classeId)?.nome ?? "classe secundária"
                }`}
              >
                <option value="">
                  {!c.classeId
                    ? "Escolha a classe"
                    : Number(c.nivel) < (obterNivelEscolhaSubclasse(c.classeId) ?? Infinity)
                    ? `Disponível no nível ${obterNivelEscolhaSubclasse(c.classeId)}`
                    : "Selecione a subclasse"}
                </option>
                {obterSubclassesPorClasse(c.classeId).map((subclasse) => (
                  <option key={subclasse.id} value={subclasse.id}>
                    {subclasse.nome}
                  </option>
                ))}
              </select>
              <button
                type="button"
                className="multiclasse-remover"
                onClick={() => onRemoverClasseSecundaria(indice)}
              >
                ×
              </button>
            </div>
          ))}
          <button
            type="button"
            className="multiclasse-adicionar"
            onClick={onAdicionarClasseSecundaria}
            disabled={nivelTotal >= 20}
            title={nivelTotal >= 20 ? "O personagem já atingiu o nível máximo (20)" : undefined}
          >
            + Adicionar classe
          </button>
        </div>
      )}

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
