import { useMemo } from "react";
import { validarFicha } from "../../utils/validacaoFicha";
import "./BlocoValidacao.css";

const TITULOS = { erro: "Erros bloqueantes", pendencia: "Escolhas pendentes", aviso: "Avisos" };

export default function BlocoValidacao({ ficha, atributosTotais, onMarcarPronta, onIrParaSecao }) {
  const resultado = useMemo(() => validarFicha(ficha, atributosTotais), [ficha, atributosTotais]);
  const grupos = ["erro", "pendencia", "aviso"].map((categoria) => ({ categoria, itens: resultado.itens.filter((item) => item.categoria === categoria) }));
  const prontaConfirmada = ficha.estadoFicha === "pronta" && resultado.pronta;
  return (
    <section className={prontaConfirmada ? "validacao-ficha is-pronta" : "validacao-ficha"} aria-live="polite">
      <div className="validacao-cabecalho"><h3 className="bloco-titulo">Prontidão para a mesa</h3><span className="validacao-status">{prontaConfirmada ? "Ficha pronta" : resultado.pronta ? "Pode confirmar" : "Rascunho"}</span></div>
      <p className="validacao-texto">{prontaConfirmada ? "A ficha foi confirmada e continua consistente." : "Você pode salvar e editar este rascunho a qualquer momento."}</p>
      {grupos.map(({ categoria, itens }) => itens.length > 0 && <div key={categoria} className={`validacao-grupo validacao-grupo--${categoria}`}><p className="validacao-aviso-titulo">{TITULOS[categoria]} ({itens.length})</p><ul className="validacao-lista">{itens.map((item, indice) => <li key={`${item.mensagem}-${indice}`}><span>{item.mensagem}</span><button type="button" className="validacao-ir" onClick={() => onIrParaSecao?.(item.secao)}>Ir para a área</button></li>)}</ul></div>)}
      <button type="button" className="validacao-confirmar" disabled={!resultado.pronta} onClick={() => onMarcarPronta?.()}>{prontaConfirmada ? "Ficha confirmada para a mesa" : "Marcar ficha como pronta"}</button>
      {!resultado.pronta && <p className="validacao-texto">Erros e escolhas pendentes impedem a confirmação; avisos não impedem.</p>}
    </section>
  );
}
