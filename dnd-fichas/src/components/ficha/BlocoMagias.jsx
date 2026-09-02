import { Fragment, useState } from "react";
import { criarMagiaVazia } from "../../utils/magia";
import { formatarModificador } from "../../utils/dnd";
import { MAGIAS } from "../../data/magiasSistema";
import ModalCatalogoMagias from "../modal/ModalCatalogoMagias";
import DetalheMagia from "../modal/DetalheMagia";
import "./BlocoMagias.css";

const NIVEIS_MAGIA = [
  { valor: 0, label: "Truque" },
  { valor: 1, label: "1º nível" },
  { valor: 2, label: "2º nível" },
  { valor: 3, label: "3º nível" },
  { valor: 4, label: "4º nível" },
  { valor: 5, label: "5º nível" },
  { valor: 6, label: "6º nível" },
  { valor: 7, label: "7º nível" },
  { valor: 8, label: "8º nível" },
  { valor: 9, label: "9º nível" },
];

export default function BlocoMagias({
  classe,
  modificadorAtributoPrincipal,
  bonusProficiencia,
  espacosMagia,
  onChangeEspacoMagia,
  magias,
  onChangeMagias,
}) {
  const temAtributoPrincipal = modificadorAtributoPrincipal !== null;
  const cdMagia = temAtributoPrincipal
    ? 8 + bonusProficiencia + modificadorAtributoPrincipal
    : null;
  const ataqueMagico = temAtributoPrincipal
    ? bonusProficiencia + modificadorAtributoPrincipal
    : null;

  const [modalAberto, setModalAberto] = useState(false);
  const [expandidas, setExpandidas] = useState(() => new Set());

  function encontrarMagiaCatalogo(nome) {
    const termo = nome.trim().toLowerCase();
    if (!termo) return null;
    return MAGIAS.find((magia) => magia.nome.toLowerCase() === termo) ?? null;
  }

  function alternarExpandida(id) {
    setExpandidas((atual) => {
      const proxima = new Set(atual);
      if (proxima.has(id)) {
        proxima.delete(id);
      } else {
        proxima.add(id);
      }
      return proxima;
    });
  }

  function handleAdicionarDoCatalogo(magiaCatalogo) {
    onChangeMagias([
      ...magias,
      {
        id: crypto.randomUUID(),
        nome: magiaCatalogo.nome,
        nivel: magiaCatalogo.nivel,
        preparada: false,
      },
    ]);
  }

  function handleAdicionarMagia() {
    onChangeMagias([...magias, criarMagiaVazia()]);
  }

  function handleRemoverMagia(id) {
    onChangeMagias(magias.filter((magia) => magia.id !== id));
  }

  function handleAlterarMagia(id, campo, valor) {
    onChangeMagias(
      magias.map((magia) =>
        magia.id === id ? { ...magia, [campo]: valor } : magia
      )
    );
  }

  function handleChangeEspaco(nivel, campo, evento) {
    const novoValor = Math.max(0, Number(evento.target.value) || 0);
    onChangeEspacoMagia(nivel, campo, novoValor);
  }

  return (
    <>
      <section>
        <h3 className="bloco-titulo">Conjuração</h3>
        {!classe ? (
          <p className="magias-aviso">
            Escolha uma classe para calcular a CD e o bônus de ataque mágico.
          </p>
        ) : (
          <div className="magias-resumo">
            <div className="magias-resumo-item">
              <span className="magias-resumo-label">Atributo de conjuração</span>
              <span className="magias-resumo-valor">
                {classe.atributoPrincipal
                  ? classe.atributoPrincipal.charAt(0).toUpperCase() +
                    classe.atributoPrincipal.slice(1)
                  : "—"}
              </span>
            </div>
            <div className="magias-resumo-item">
              <span className="magias-resumo-label">CD de magia</span>
              <span className="magias-resumo-valor">{cdMagia}</span>
            </div>
            <div className="magias-resumo-item">
              <span className="magias-resumo-label">Bônus de ataque</span>
              <span className="magias-resumo-valor">
                {formatarModificador(ataqueMagico)}
              </span>
            </div>
          </div>
        )}
      </section>

      <section>
        <h3 className="bloco-titulo">Espaços de magia</h3>
        <div className="espacos-magia-grid">
          {Object.entries(espacosMagia).map(([nivel, espaco]) => (
            <div key={nivel} className="espaco-magia-campo">
              <span className="espaco-magia-nivel">{nivel}º</span>
              <input
                type="number"
                min="0"
                className="espaco-magia-input"
                value={espaco.usados}
                onChange={(evento) => handleChangeEspaco(nivel, "usados", evento)}
                aria-label={`Espaços usados de nível ${nivel}`}
              />
              <span className="espaco-magia-separador">/</span>
              <input
                type="number"
                min="0"
                className="espaco-magia-input"
                value={espaco.total}
                onChange={(evento) => handleChangeEspaco(nivel, "total", evento)}
                aria-label={`Espaços totais de nível ${nivel}`}
              />
            </div>
          ))}
        </div>
      </section>

      <section>
        <h3 className="bloco-titulo">Magias conhecidas</h3>

        <button
          type="button"
          className="magias-abrir-catalogo"
          onClick={() => setModalAberto(true)}
        >
          Adicionar Magias
        </button>

        <ModalCatalogoMagias
          aberto={modalAberto}
          onFechar={() => setModalAberto(false)}
          onAdicionarMagia={handleAdicionarDoCatalogo}
        />

        {magias.length === 0 ? (
          <p className="magias-vazio">Nenhuma magia cadastrada ainda.</p>
        ) : (
          <table className="magias-tabela">
            <thead>
              <tr>
                <th aria-label="Expandir"></th>
                <th>Magia</th>
                <th>Nível</th>
                <th>Preparada</th>
                <th aria-label="Remover"></th>
              </tr>
            </thead>
            <tbody>
              {magias.map((magia) => {
                const dadosCatalogo = encontrarMagiaCatalogo(magia.nome);
                const aberta = expandidas.has(magia.id);

                return (
                  <Fragment key={magia.id}>
                    <tr>
                      <td className="magias-coluna-expandir">
                        <button
                          type="button"
                          className="magias-expandir"
                          onClick={() => alternarExpandida(magia.id)}
                          aria-expanded={aberta}
                          aria-label={
                            aberta ? "Recolher detalhes" : "Expandir detalhes"
                          }
                        >
                          <span
                            className={
                              aberta ? "magias-seta is-aberta" : "magias-seta"
                            }
                          >
                            ▾
                          </span>
                        </button>
                      </td>
                      <td>
                        <input
                          type="text"
                          value={magia.nome}
                          placeholder="Nome da magia"
                          onChange={(evento) =>
                            handleAlterarMagia(magia.id, "nome", evento.target.value)
                          }
                        />
                      </td>
                      <td>
                        <select
                          value={magia.nivel}
                          onChange={(evento) =>
                            handleAlterarMagia(
                              magia.id,
                              "nivel",
                              Number(evento.target.value)
                            )
                          }
                        >
                          {NIVEIS_MAGIA.map((nivel) => (
                            <option key={nivel.valor} value={nivel.valor}>
                              {nivel.label}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="magias-coluna-preparada">
                        <input
                          type="checkbox"
                          checked={magia.preparada}
                          onChange={(evento) =>
                            handleAlterarMagia(
                              magia.id,
                              "preparada",
                              evento.target.checked
                            )
                          }
                          aria-label={`${magia.nome || "Magia"} preparada`}
                        />
                      </td>
                      <td>
                        <button
                          type="button"
                          className="magias-remover"
                          onClick={() => handleRemoverMagia(magia.id)}
                          aria-label={`Remover ${magia.nome || "magia"}`}
                        >
                          ×
                        </button>
                      </td>
                    </tr>
                    {aberta && (
                      <tr>
                        <td colSpan={5} className="magias-linha-detalhe">
                          {dadosCatalogo ? (
                            <DetalheMagia magia={dadosCatalogo} />
                          ) : (
                            <p className="magias-sem-catalogo">
                              Essa é uma magia personalizada — sem dados de
                              resistência, dano ou condição cadastrados.
                            </p>
                          )}
                        </td>
                      </tr>
                    )}
                  </Fragment>
                );
              })}
            </tbody>
          </table>
        )}

        <button
          type="button"
          className="magias-adicionar"
          onClick={handleAdicionarMagia}
        >
          + Magia personalizada
        </button>
      </section>
    </>
  );
}
