import { ATRIBUTOS } from "../../utils/dnd";
import AtributoCard from "./AtributoCard";
import "./BlocoAtributos.css";

export default function BlocoAtributos({
  atributos,
  bonusRacial = {},
  onChangeAtributo,
}) {
  return (
    <section>
      <h3 className="bloco-titulo">Atributos</h3>
      <div className="bloco-atributos-grid">
        {ATRIBUTOS.map((atributo) => (
          <AtributoCard
            key={atributo.chave}
            label={atributo.label}
            abreviacao={atributo.abreviacao}
            valor={atributos[atributo.chave]}
            bonusRacial={bonusRacial[atributo.chave] ?? 0}
            onChange={(novoValor) =>
              onChangeAtributo(atributo.chave, novoValor)
            }
          />
        ))}
      </div>
    </section>
  );
}
