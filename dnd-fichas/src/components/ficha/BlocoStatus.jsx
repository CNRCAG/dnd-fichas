import { formatarModificador } from "../../utils/dnd";
import { rolarTesteD20 } from "../../utils/dados";
import { useRolagem } from "../../context/useRolagem";
import "./BlocoStatus.css";

const CAMPOS_STATUS = [
  { chave: "pvAtual", label: "PV atual" },
  { chave: "pvMax", label: "PV máximo" },
  { chave: "pvTemp", label: "PV temporário" },
  { chave: "ca", label: "Classe de Armadura" },
  { chave: "deslocamento", label: "Deslocamento" },
];

export default function BlocoStatus({
  status,
  onChangeStatus,
  modDestreza,
  percepcaoPassiva,
  investigacaoPassiva,
}) {
  const { registrarRolagem } = useRolagem();
  const iniciativaTotal = modDestreza + (status.iniciativa ?? 0);

  function handleRolarIniciativa() {
    const resultado = rolarTesteD20(iniciativaTotal);
    registrarRolagem("Iniciativa", resultado, "d20");
  }
  const pvAtual = status.pvAtual ?? 0;
  const emAgonia = pvAtual <= 0;
  const sucessos = status.testesMorteSucessos ?? 0;
  const falhas = status.testesMorteFalhas ?? 0;
  const estabilizado = sucessos >= 3;
  const morto = falhas >= 3;

  function handleChange(chave, evento) {
    const novoValor = Number(evento.target.value);
    onChangeStatus(chave, Number.isNaN(novoValor) ? 0 : novoValor);
  }

  function handleTogglePip(tipo, indice) {
    if (tipo === "sucesso" && falhas >= 3) return;
    if (tipo === "falha" && sucessos >= 3) return;

    const chave = tipo === "sucesso" ? "testesMorteSucessos" : "testesMorteFalhas";
    const atual = tipo === "sucesso" ? sucessos : falhas;
    const novoValor = atual === indice + 1 ? indice : indice + 1;
    onChangeStatus(chave, novoValor);
  }

  function handleReiniciarTestes() {
    onChangeStatus("testesMorteSucessos", 0);
    onChangeStatus("testesMorteFalhas", 0);
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
              value={status[campo.chave] ?? 0}
              onChange={(evento) => handleChange(campo.chave, evento)}
            />
          </label>
        ))}
        
        <div className="status-campo">
          <span className="status-label">Iniciativa</span>
          <button
            type="button"
            className="status-iniciativa-botao"
            onClick={handleRolarIniciativa}
            title={`Rolar iniciativa (d20${formatarModificador(iniciativaTotal)})`}
          >
            {formatarModificador(iniciativaTotal)}
          </button>
                    <input
            type="number"
            className="status-iniciativa-bonus"
            value={status.iniciativa ?? 0}
            onChange={(evento) => handleChange("iniciativa", evento)}
            title="Bônus extra (ex: talento Alerta)"
          />
        </div>
      </div>

      <div className="status-passivas">
        <span>
          Percepção passiva: <strong>{percepcaoPassiva}</strong>
        </span>
        <span>
          Investigação passiva: <strong>{investigacaoPassiva}</strong>
        </span>
      </div>

      {emAgonia && (
        <div
          className={
            morto
              ? "testes-morte is-morto"
              : estabilizado
              ? "testes-morte is-estabilizado"
              : "testes-morte"
          }
        >
          <h4
            className={
              !morto && estabilizado ? "testes-morte-titulo is-estabilizado" : "testes-morte-titulo"
            }
          >
            {morto ? "Morto" : estabilizado ? "Estabilizado" : "Testes de Morte"}
          </h4>
          <div className="testes-morte-linhas">
            <div className="testes-morte-linha">
              <span className="testes-morte-label">Sucessos</span>
              {[0, 1, 2].map((indice) => (
                <button
                  key={indice}
                  type="button"
                  className={
                    indice < sucessos
                      ? "testes-morte-pip is-sucesso"
                      : "testes-morte-pip"
                  }
                  onClick={() => handleTogglePip("sucesso", indice)}
                  disabled={morto}
                  aria-label={`Sucesso ${indice + 1}`}
                />
              ))}
            </div>
            <div className="testes-morte-linha">
              <span className="testes-morte-label">Falhas</span>
              {[0, 1, 2].map((indice) => (
                <button
                  key={indice}
                  type="button"
                  className={
                    indice < falhas ? "testes-morte-pip is-falha" : "testes-morte-pip"
                  }
                  onClick={() => handleTogglePip("falha", indice)}
                  disabled={estabilizado}
                  aria-label={`Falha ${indice + 1}`}
                />
              ))}
            </div>
          </div>
          <button
            type="button"
            className="testes-morte-reiniciar"
            onClick={handleReiniciarTestes}
          >
            Reiniciar
          </button>
        </div>
      )}

      <p className="status-nota">
        A Classe de Armadura é recalculada sozinha quando você equipa ou
        desequipa uma armadura no Inventário — mas ainda dá pra digitar um
        valor manual aqui a qualquer momento.
      </p>
    </section>
  );
}
