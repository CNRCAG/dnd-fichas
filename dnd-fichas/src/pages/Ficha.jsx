import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { useFichas } from "../context/useFichas";
import { obterRaca } from "../data/racas";
import { obterClasse } from "../data/classes";
import { calcularBonusProficiencia, calcularModificadoresAtributos } from "../utils/dnd";
import { criarEspacosMagiaVazios } from "../utils/magia";
import BlocoRacaClasse from "../components/ficha/BlocoRacaClasse";
import BlocoAtributos from "../components/ficha/BlocoAtributos";
import BlocoStatus from "../components/ficha/BlocoStatus";
import BlocoSalvaguardas from "../components/ficha/BlocoSalvaguardas";
import BlocoPericias from "../components/ficha/BlocoPericias";
import BlocoInventario from "../components/ficha/BlocoInventario";
import BlocoMoedas from "../components/ficha/BlocoMoedas";
import BlocoMagias from "../components/ficha/BlocoMagias";
import "./Ficha.css";

const ABAS = [
  { chave: "combate", label: "Combate" },
  { chave: "pericias", label: "Perícias" },
  { chave: "magias", label: "Magias" },
  { chave: "inventario", label: "Inventário" },
  { chave: "notas", label: "Notas" },
];

export default function Ficha() {
  const { id } = useParams();
  const { obterFicha, atualizarFicha } = useFichas();
  const ficha = obterFicha(id);
  const [abaAtiva, setAbaAtiva] = useState("combate");

  if (!ficha) {
    return (
      <div>
        <h2>Ficha não encontrada</h2>
        <p>
          Essa ficha não existe ou foi removida. <Link to="/nova">Crie uma nova</Link>.
        </p>
      </div>
    );
  }

  const raca = obterRaca(ficha.racaId);
  const classe = obterClasse(ficha.classeId);
  const bonusRacial = raca?.bonusAtributos ?? {};
  const bonusProficiencia = calcularBonusProficiencia(ficha.nivel ?? 1);
  const modificadoresAtributos = calcularModificadoresAtributos(
    ficha.atributos,
    bonusRacial
  );

  function handleChangeAtributo(chave, novoValor) {
    atualizarFicha(id, (ficha) => ({
      atributos: { ...ficha.atributos, [chave]: novoValor },
    }));
  }

  function handleChangeStatus(chave, novoValor) {
    atualizarFicha(id, (ficha) => ({
      status: { ...ficha.status, [chave]: novoValor },
    }));
  }

  function handleChangeRaca(novoRacaId) {
    atualizarFicha(id, () => ({ racaId: novoRacaId }));
  }

  function handleChangeClasse(novoClasseId) {
    atualizarFicha(id, () => ({ classeId: novoClasseId }));
  }

  function handleChangeNivel(novoNivel) {
    atualizarFicha(id, () => ({ nivel: novoNivel }));
  }

  function handleTogglePericia(chave) {
    atualizarFicha(id, (ficha) => ({
      pericias: {
        ...ficha.pericias,
        [chave]: !ficha.pericias?.[chave],
      },
    }));
  }

  function handleChangeInventario(novoInventario) {
    atualizarFicha(id, () => ({ inventario: novoInventario }));
  }

  function handleChangeMoedas(chave, novoValor) {
    atualizarFicha(id, (ficha) => ({
      moedas: { ...ficha.moedas, [chave]: novoValor },
    }));
  }

  function handleChangeMagias(novasMagias) {
    atualizarFicha(id, () => ({ magias: novasMagias }));
  }

  function handleChangeEspacoMagia(nivel, campo, novoValor) {
    atualizarFicha(id, (ficha) => ({
      espacosMagia: {
        ...ficha.espacosMagia,
        [nivel]: { ...ficha.espacosMagia[nivel], [campo]: novoValor },
      },
    }));
  }

  function handleChangeNome(evento) {
    const valor = evento.target.value;
    atualizarFicha(id, () => ({ nome: valor || "Sem nome" }));
  }

  function handleChangeNotas(evento) {
    const valor = evento.target.value;
    atualizarFicha(id, () => ({ notas: valor }));
  }

  return (
    <div className="ficha-shell">
      <aside className="ficha-coluna-fixa">
        <input
          type="text"
          className="ficha-nome-input"
          value={ficha.nome}
          onChange={handleChangeNome}
          aria-label="Nome do personagem"
        />

        <BlocoRacaClasse
          racaId={ficha.racaId}
          classeId={ficha.classeId}
          nivel={ficha.nivel ?? 1}
          onChangeRaca={handleChangeRaca}
          onChangeClasse={handleChangeClasse}
          onChangeNivel={handleChangeNivel}
        />

        <div className="ficha-stats-rapidas">
          <div className="ficha-stat-rapida">
            <span className="ficha-stat-label">Vida</span>
            <span className="ficha-stat-valor">
              {ficha.status.pvAtual}/{ficha.status.pvMax}
            </span>
          </div>
          <div className="ficha-stat-rapida">
            <span className="ficha-stat-label">Defesa</span>
            <span className="ficha-stat-valor">{ficha.status.ca}</span>
          </div>
        </div>

        <BlocoAtributos
          atributos={ficha.atributos}
          bonusRacial={bonusRacial}
          onChangeAtributo={handleChangeAtributo}
        />
      </aside>

      <div className="ficha-coluna-principal">
        <nav className="ficha-abas">
          {ABAS.map((aba) => (
            <button
              key={aba.chave}
              type="button"
              className={
                abaAtiva === aba.chave ? "ficha-aba is-ativa" : "ficha-aba"
              }
              onClick={() => setAbaAtiva(aba.chave)}
            >
              {aba.label}
            </button>
          ))}
        </nav>

        <div className="ficha-conteudo-aba">
          {abaAtiva === "combate" && (
            <>
              <BlocoStatus status={ficha.status} onChangeStatus={handleChangeStatus} />
              <BlocoSalvaguardas
                modificadoresAtributos={modificadoresAtributos}
                salvaguardasProficientes={classe?.salvaguardasProficientes}
                bonusProficiencia={bonusProficiencia}
              />
            </>
          )}

          {abaAtiva === "pericias" && (
            <BlocoPericias
              modificadoresAtributos={modificadoresAtributos}
              pericias={ficha.pericias ?? {}}
              bonusProficiencia={bonusProficiencia}
              onTogglePericia={handleTogglePericia}
            />
          )}

          {abaAtiva === "magias" && (
            <BlocoMagias
              classe={classe}
              modificadorAtributoPrincipal={
                classe ? modificadoresAtributos[classe.atributoPrincipal] : null
              }
              bonusProficiencia={bonusProficiencia}
              espacosMagia={ficha.espacosMagia ?? criarEspacosMagiaVazios()}
              onChangeEspacoMagia={handleChangeEspacoMagia}
              magias={ficha.magias ?? []}
              onChangeMagias={handleChangeMagias}
            />
          )}

          {abaAtiva === "inventario" && (
            <>
              <BlocoInventario
                inventario={ficha.inventario ?? []}
                onChangeInventario={handleChangeInventario}
              />
              <BlocoMoedas moedas={ficha.moedas ?? {}} onChangeMoedas={handleChangeMoedas} />
            </>
          )}

          {abaAtiva === "notas" && (
            <section>
              <h3 className="bloco-titulo">Notas</h3>
              <textarea
                className="ficha-notas-textarea"
                placeholder="Anotações livres sobre a campanha, o personagem, contatos..."
                value={ficha.notas ?? ""}
                onChange={handleChangeNotas}
              />
            </section>
          )}
        </div>
      </div>
    </div>
  );
}
