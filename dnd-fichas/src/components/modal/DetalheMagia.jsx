import { ESCOLAS } from "../../data/magiasSistema";
import { ATRIBUTOS } from "../../utils/dnd";

function labelResistencia(magia) {
  if (magia.resistencia) {
    const atributo = ATRIBUTOS.find((a) => a.chave === magia.resistencia);
    return `${atributo?.label ?? magia.resistencia} (${atributo?.abreviacao ?? "?"})`;
  }
  if (magia.ataque) return "Ataque mágico (sem resistência)";
  return "Nenhuma";
}

export default function DetalheMagia({ magia }) {
  const temEfeitoMecanico = Boolean(magia.dano || magia.condicao);

  return (
    <dl className="item-catalogo-detalhes">
      <div>
        <dt>Escola</dt>
        <dd>{ESCOLAS[magia.escola] ?? magia.escola}</dd>
      </div>
      <div>
        <dt>Tempo de conjuração</dt>
        <dd>{magia.tempo}</dd>
      </div>
      <div>
        <dt>Alcance</dt>
        <dd>{magia.alcance}</dd>
      </div>
      <div>
        <dt>Componentes</dt>
        <dd>{magia.componentes}</dd>
      </div>
      <div className="item-catalogo-detalhe-full">
        <dt>Duração</dt>
        <dd>
          {magia.duracao}
          {magia.ritual ? " (pode ser conjurada como ritual)" : ""}
        </dd>
      </div>
      <div>
        <dt>Resistência (ST)</dt>
        <dd>{labelResistencia(magia)}</dd>
      </div>
      {magia.dano && (
        <div>
          <dt>Dano</dt>
          <dd>{magia.dano}</dd>
        </div>
      )}
      {magia.condicao && (
        <div className={magia.dano ? "item-catalogo-detalhe-full" : ""}>
          <dt>Condição</dt>
          <dd>{magia.condicao}</dd>
        </div>
      )}
      {!temEfeitoMecanico && (
        <div className="item-catalogo-detalhe-full">
          <dt>Dano/Condição</dt>
          <dd>Nenhum — efeito utilitário ou de suporte.</dd>
        </div>
      )}
      <div className="item-catalogo-detalhe-full">
        <dt>Efeito</dt>
        <dd>{magia.descricao}</dd>
      </div>
    </dl>
  );
}
