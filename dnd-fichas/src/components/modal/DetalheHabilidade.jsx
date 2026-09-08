export default function DetalheHabilidade({ item, tipo }) {
  return (
    <dl className="item-catalogo-detalhes">
      {(tipo === "classe" || tipo === "subclasse") && (
        <div>
          <dt>Nível</dt>
          <dd>{item.nivel}º</dd>
        </div>
      )}
      <div className="item-catalogo-detalhe-full">
        <dt>Efeito</dt>
        <dd>{item.descricao}</dd>
      </div>
    </dl>
  );
}
