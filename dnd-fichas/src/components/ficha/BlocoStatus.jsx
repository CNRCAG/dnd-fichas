import { useState } from "react"
import { formatarModificador } from "../../utils/dnd";
import { rolarTesteD20 } from "../../utils/dados";
import { useRolagem } from "../../context/useRolagem";
import "./BlocoStatus.css";

const CAMPOS_STATUS = [
  { chave: "pvAtual", label: "PV atual" },
  { chave: "pvTemp", label: "PV temporário" },
  { chave: "pvMax", label: "PV máximo" },
  { chave: "ca", label: "Classe de Armadura" },
  { chave: "deslocamento", label: "Deslocamento" },
];

export default function BlocoStatus({
  status,
  onChangeStatus,
  modDestreza,
  modConstituicao,           // NOVO
  percepcaoPassiva,
  investigacaoPassiva,
  concentracao,              // NOVO
  avisoConcentracao,         // NOVO
  onPararConcentracao,       // NOVO
  onFecharAvisoConcentracao, // NOVO
}) {
    const { registrarRolagem } = useRolagem();
  const [resultadoConcentracao, setResultadoConcentracao] = useState(null);
  const [ultimoAvisoConcentracao, setUltimoAvisoConcentracao] = useState(avisoConcentracao);
  const iniciativaTotal = modDestreza + (status.iniciativa ?? 0);

  // Zera o resultado do teste anterior sempre que chega um aviso novo
  // (dano novo). Ajuste de estado durante o render, sem useEffect — é
  // o padrão recomendado pra "resetar estado quando uma prop muda".
  if (avisoConcentracao !== ultimoAvisoConcentracao) {
    setUltimoAvisoConcentracao(avisoConcentracao);
    setResultadoConcentracao(null);
  }

  function handleTestarConcentracao() {
    const resultado = rolarTesteD20(modConstituicao);
    const sucesso = resultado.total >= avisoConcentracao.cd;
    registrarRolagem(
      `Teste de concentração (CD ${avisoConcentracao.cd})`,
      resultado,
      "d20"
    );
    setResultadoConcentracao({ sucesso, total: resultado.total });
    if (!sucesso) {
      onPararConcentracao();
    }
  }

  

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

            {concentracao && (
        <div className="concentracao-bloco">
          <span className="concentracao-texto">
            🎯 Concentrado em <strong>{concentracao.nome}</strong>
          </span>
          <button
            type="button"
            className="concentracao-parar-botao"
            onClick={onPararConcentracao}
          >
            Parar
          </button>
        </div>
      )}

      {avisoConcentracao && (
        <div className="concentracao-aviso">
          <p className="concentracao-aviso-texto">
            ⚠ Você tomou dano — faça um teste de Constituição (CD{" "}
            {avisoConcentracao.cd}) para manter a concentração.
          </p>
          {!resultadoConcentracao ? (
            <button
              type="button"
              className="concentracao-testar-botao"
              onClick={handleTestarConcentracao}
            >
              🎲 Rolar teste ({formatarModificador(modConstituicao)})
            </button>
          ) : (
            <>
              <p
                className={
                  resultadoConcentracao.sucesso
                    ? "concentracao-resultado is-sucesso"
                    : "concentracao-resultado is-falha"
                }
              >
                {resultadoConcentracao.sucesso
                  ? `Sucesso! (${resultadoConcentracao.total} ≥ ${avisoConcentracao.cd}) — continua concentrado.`
                  : `Falhou (${resultadoConcentracao.total} < ${avisoConcentracao.cd}) — concentração perdida.`}
              </p>
              <button
                type="button"
                className="concentracao-testar-botao"
                onClick={onFecharAvisoConcentracao}
              >
                OK
              </button>
            </>
          )}
        </div>
      )}

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
