import { rolarDado } from "../../utils/dados";
import { useRolagem } from "../../context/useRolagem";
import "./BlocoDescanso.css";

export default function BlocoDescanso({
  classe,
  nivel,
  modConstituicao,
  status,
  dadosDeVidaUsados,
  onGastarDadoDeVida,
  onRestaurarEspacosMagia,
  onDescansoLongo,
}) {
  const { registrarRolagem } = useRolagem();

  if (!classe) return null;

  const dadosTotais = nivel;
  const dadosDisponiveis = Math.max(0, dadosTotais - (dadosDeVidaUsados ?? 0));
  const ehBruxo = classe.id === "bruxo";

  function handleGastarDado() {
    if (dadosDisponiveis <= 0) return;
    const dado = rolarDado(classe.dadoVida);
    const cura = Math.max(0, dado + modConstituicao);
    registrarRolagem(
      `Dado de vida (d${classe.dadoVida})`,
      {
        formula: `1d${classe.dadoVida}+${modConstituicao}`,
        total: cura,
        detalhes: [
          { texto: `1d${classe.dadoVida}`, rolagens: [dado], soma: dado },
          { texto: "mod. CON", rolagens: [], soma: modConstituicao },
        ],
      },
      "formula"
    );
    onGastarDadoDeVida(cura);
  }

  return (
    <section>
      <h3 className="bloco-titulo">Descanso</h3>

      <div className="descanso-bloco">
        <h4 className="descanso-subtitulo">Descanso Curto</h4>
        <p className="descanso-texto">
          Dados de vida disponíveis: {dadosDisponiveis} de {dadosTotais}
        </p>
        <button
          type="button"
          className="descanso-botao"
          onClick={handleGastarDado}
          disabled={dadosDisponiveis <= 0}
        >
          🎲 Gastar 1 dado de vida (1d{classe.dadoVida} + CON)
        </button>

        {ehBruxo && (
          <button
            type="button"
            className="descanso-botao descanso-botao--secundario"
            onClick={onRestaurarEspacosMagia}
          >
            🔮 Restaurar espaços de magia (Pacto)
          </button>
        )}
      </div>

      <div className="descanso-bloco">
        <h4 className="descanso-subtitulo">Descanso Longo</h4>
        <p className="descanso-texto">
          Restaura todo o PV, todos os espaços de magia, e{" "}
          {Math.max(1, Math.floor(nivel / 2))} dado(s) de vida.
        </p>
        <button type="button" className="descanso-botao" onClick={onDescansoLongo}>
          🌙 Fazer descanso longo
        </button>
      </div>

      <p className="status-nota">
        PV atual: {status.pvAtual} / {status.pvMax}
      </p>
    </section>
  );
}