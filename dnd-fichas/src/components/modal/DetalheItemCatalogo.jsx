import { RARIDADES } from "../../data/raridades";

export default function DetalheItemCatalogo({ item }) {
  const { tipoItem, original } = item;
  const nomeRaridade = RARIDADES.find((raridade) => raridade.id === original.raridade)?.label;

  if (item.grupo === "Itens mágicos") {
    return (
      <dl className="item-catalogo-detalhes">
        <div>
          <dt>Raridade</dt>
          <dd>{nomeRaridade ?? original.raridade}</dd>
        </div>
        <div>
          <dt>Sintonização</dt>
          <dd>{original.requerSintonizacao ? "Necessária" : "Não necessária"}</dd>
        </div>
        {original.cargas && (
          <div>
            <dt>Cargas</dt>
            <dd>{original.cargas.maximo}</dd>
          </div>
        )}
        {original.recarga && (
          <div>
            <dt>Recarga</dt>
            <dd>{original.recarga.formula} ao {original.recarga.momento}</dd>
          </div>
        )}
        <div className="item-catalogo-detalhe-full">
          <dt>Regras</dt>
          <dd>{original.regras.join(" ")}</dd>
        </div>
      </dl>
    );
  }

  if (tipoItem === "arma") {
    return (
      <dl className="item-catalogo-detalhes">
        <div>
          <dt>Categoria</dt>
          <dd>{original.categoria === "simples" ? "Simples" : "Marcial"}</dd>
        </div>
        <div>
          <dt>Tipo</dt>
          <dd>{original.tipo === "corpoACorpo" ? "Corpo a corpo" : "À distância"}</dd>
        </div>
        <div>
          <dt>Dano</dt>
          <dd>
            {original.dano} {original.tipoDano ?? ""}
          </dd>
        </div>
        {original.propriedades?.length > 0 && (
          <div className="item-catalogo-detalhe-full">
            <dt>Propriedades</dt>
            <dd>{original.propriedades.join(", ")}</dd>
          </div>
        )}
        <div>
          <dt>Peso</dt>
          <dd>{original.peso} kg</dd>
        </div>
        <div>
          <dt>Custo</dt>
          <dd>{original.custo} po</dd>
        </div>
      </dl>
    );
  }

  if (tipoItem === "armadura") {
    return (
      <dl className="item-catalogo-detalhes">
        <div>
          <dt>Tipo</dt>
          <dd>
            {{ leve: "Leve", media: "Média", pesada: "Pesada", escudo: "Escudo" }[
              original.tipo
            ] ?? original.tipo}
          </dd>
        </div>
        <div>
          <dt>Classe de Armadura</dt>
          <dd>{original.ca}</dd>
        </div>
        <div>
          <dt>Força mínima</dt>
          <dd>{original.forcaMinima ?? "—"}</dd>
        </div>
        <div>
          <dt>Furtividade</dt>
          <dd>{original.desvantagemFurtividade ? "Desvantagem" : "Normal"}</dd>
        </div>
        <div>
          <dt>Peso</dt>
          <dd>{original.peso} kg</dd>
        </div>
        <div>
          <dt>Custo</dt>
          <dd>{original.custo} po</dd>
        </div>
      </dl>
    );
  }

  return (
    <dl className="item-catalogo-detalhes">
      {original.descricao && (
        <div className="item-catalogo-detalhe-full">
          <dt>Descrição</dt>
          <dd>{original.descricao}</dd>
        </div>
      )}
      <div>
        <dt>Peso</dt>
        <dd>{original.peso} kg</dd>
      </div>
      <div>
        <dt>Custo</dt>
        <dd>{original.custo} po</dd>
      </div>
    </dl>
  );
}
