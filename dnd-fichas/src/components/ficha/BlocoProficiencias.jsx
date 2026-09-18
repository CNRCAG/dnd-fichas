import { IDIOMAS } from "../../data/idiomas";
import { FERRAMENTAS } from "../../data/equipamentos";
import { ATRIBUTOS, formatarModificador } from "../../utils/dnd";
import { rolarTesteD20 } from "../../utils/dados";
import { useRolagem } from "../../context/useRolagem";
import "./BlocoProficiencias.css";

const IDIOMAS_PADRAO = IDIOMAS.filter((idioma) => idioma.tipo === "padrao");
const IDIOMAS_EXOTICOS = IDIOMAS.filter((idioma) => idioma.tipo === "exotico");

export default function BlocoProficiencias({
  idiomas,
  onToggleIdioma,
  proficienciasFerramentas,
  proficienciasArmas = [],
  proficienciasArmaduras = [],
  proficienciasEscudos = false,
  onToggleFerramenta,
  atributoFerramentas,
  onChangeAtributoFerramenta,
  modificadoresAtributos,
  bonusProficiencia,
  origensProficiencias = {},
}) {
  const { registrarRolagem } = useRolagem();

  function renderChipsIdiomas(lista) {
    return lista.map((idioma) => {
      const conhecido = idiomas.includes(idioma.id);
      return (
        <label
          key={idioma.id}
          className={conhecido ? "idioma-chip is-ativo" : "idioma-chip"}
        >
          <input
            type="checkbox"
            checked={conhecido}
            onChange={() => onToggleIdioma(idioma.id)}
          />
          {idioma.nome}
        </label>
      );
    });
  }

  function handleRolarFerramenta(ferramenta, proficiente) {
    const atributoChave = atributoFerramentas[ferramenta.id] ?? "inteligencia";
    const modificador =
      modificadoresAtributos[atributoChave] + (proficiente ? bonusProficiencia : 0);
    const resultado = rolarTesteD20(modificador);
    registrarRolagem(`Ferramenta: ${ferramenta.nome}`, resultado, "d20");
  }

  return (
    <>
      <section>
        <h3 className="bloco-titulo">Idiomas</h3>
        <p className="proficiencias-nota">
          Idiomas, ferramentas e proficiências de criação são aplicados automaticamente.
          Você ainda pode registrar concessões manuais ou de regra da mesa aqui.
        </p>

        <h4 className="proficiencias-subtitulo">Padrão</h4>
        <div className="idiomas-grid">{renderChipsIdiomas(IDIOMAS_PADRAO)}</div>

        <h4 className="proficiencias-subtitulo">Exóticos</h4>
        <div className="idiomas-grid">{renderChipsIdiomas(IDIOMAS_EXOTICOS)}</div>
      </section>

      <section>
        <h3 className="bloco-titulo">Proficiências de combate</h3>
        <p className="proficiencias-nota">
          Armas: {proficienciasArmas.length ? proficienciasArmas.join(", ") : "nenhuma registrada"}.<br />
          Armaduras: {proficienciasArmaduras.length ? proficienciasArmaduras.join(", ") : "nenhuma registrada"}.<br />
          Escudos: {proficienciasEscudos ? "proficiente" : "não registrado"}.
        </p>
      </section>

      <section>
        <h3 className="bloco-titulo">Ferramentas</h3>
        <p className="proficiencias-nota">
          Proficiência com ferramentas, separada do inventário: marque aqui
          mesmo que o item físico ainda não tenha sido comprado na aba
          Inventário. Escolha o atributo usado em cada uma (a maioria das
          ferramentas de artesão usa Inteligência, mas isso varia por mesa).
        </p>
        <ul className="ferramentas-lista">
          {FERRAMENTAS.map((ferramenta) => {
            const proficiente = proficienciasFerramentas.includes(ferramenta.id);
            const origem = (origensProficiencias.ferramentas?.[ferramenta.id] ?? []).join(", ");
            const atributoChave = atributoFerramentas[ferramenta.id] ?? "inteligencia";
            const modificadorAtributo = modificadoresAtributos[atributoChave];
            const modificador =
              modificadorAtributo + (proficiente ? bonusProficiencia : 0);

            return (
              <li key={ferramenta.id} className="ferramenta-item">
                <label className="ferramenta-checkbox-label">
                  <input
                    type="checkbox"
                    checked={proficiente}
                    onChange={() => onToggleFerramenta(ferramenta.id)}
                  />
                  <span className="ferramenta-nome">{ferramenta.nome}{origem && <small> · {origem}</small>}</span>
                </label>

                <select
                  className="ferramenta-atributo-select"
                  value={atributoChave}
                  onChange={(evento) =>
                    onChangeAtributoFerramenta(ferramenta.id, evento.target.value)
                  }
                  aria-label={`Atributo usado com ${ferramenta.nome}`}
                >
                  {ATRIBUTOS.map((atributo) => (
                    <option key={atributo.chave} value={atributo.chave}>
                      {atributo.abreviacao}
                    </option>
                  ))}
                </select>

                <button
                  type="button"
                  className="ferramenta-rolar-botao"
                  onClick={() => handleRolarFerramenta(ferramenta, proficiente)}
                  title={`Rolar ${ferramenta.nome} (d20${formatarModificador(modificador)})`}
                >
                  🎲 {formatarModificador(modificador)}
                </button>
              </li>
            );
          })}
        </ul>
      </section>
    </>
  );
}
