import { useState } from "react";
import { criarItemVazio } from "../../utils/inventario";
import { RARIDADES } from "../../data/raridades";   // NOVO
import ModalCatalogoItens from "../modal/ModalCatalogoItens";
import "./BlocoInventario.css";

export default function BlocoInventario({ inventario, onChangeInventario, forcaTotal }) {
  const [modalAberto, setModalAberto] = useState(false);
  const pesoTotal = inventario.reduce(
    (soma, item) => soma + item.quantidade * item.peso,
    0
  );
  const capacidadeCarga = forcaTotal * 7.5;
  const sobrecarregado = pesoTotal > capacidadeCarga;

  function handleAdicionarItem() {
    onChangeInventario([...inventario, criarItemVazio()]);
  }

   function handleAdicionarDoCatalogo(item) {
    onChangeInventario([
      ...inventario,
      {
        id: crypto.randomUUID(),
        nome: item.nome,
        quantidade: 1,
        peso: item.peso,
        tipoItem: item.tipoItem,
        origemId: item.id,
        equipado: false,
        atributoAtaque: "auto",
        magico: false,       // NOVO
        raridade: null,      // NOVO
        bonusMagico: 0,      // NOVO
      },
    ]);
  }

  function handleRemoverItem(id) {
    onChangeInventario(inventario.filter((item) => item.id !== id));
  }

  function handleAlterarItem(id, campo, valor) {
    onChangeInventario(
      inventario.map((item) =>
        item.id === id ? { ...item, [campo]: valor } : item
      )
    );
  }

  return (
    <section>
      <div className="inventario-cabecalho">
        <h3 className="bloco-titulo">Inventário</h3>
        <span className={sobrecarregado ? "inventario-peso is-sobrecarregado" : "inventario-peso"}>
          Peso total: {pesoTotal} / {capacidadeCarga} kg
          {sobrecarregado && " (sobrecarregado!)"}
        </span>
      </div>

      <button
        type="button"
        className="inventario-abrir-catalogo"
        onClick={() => setModalAberto(true)}
      >
        Adicionar Itens
      </button>

      <ModalCatalogoItens
        aberto={modalAberto}
        onFechar={() => setModalAberto(false)}
        onAdicionarItem={handleAdicionarDoCatalogo}
      />

      {inventario.length === 0 ? (
        <p className="inventario-vazio">Nenhum item ainda.</p>
      ) : (
        <table className="inventario-tabela">
          <thead>
            <tr>
              <th>Item</th>
              <th>Qtd.</th>
              <th>Peso (kg)</th>
              <th>Equipado</th>
              <th>Ataca com</th>
              <th aria-label="Remover"></th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((item) => {
              const podeEquipar =
                item.tipoItem === "arma" || item.tipoItem === "armadura";

              return (
                <tr key={item.id}>
                  <td>
                    <input
                      type="text"
                      value={item.nome}
                      placeholder="Nome do item"
                      onChange={(evento) =>
                        handleAlterarItem(item.id, "nome", evento.target.value)
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      className="inventario-input-numero"
                      value={item.quantidade}
                      onChange={(evento) =>
                        handleAlterarItem(
                          item.id,
                          "quantidade",
                          Number(evento.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td>
                    <input
                      type="number"
                      min="0"
                      step="0.1"
                      className="inventario-input-numero"
                      value={item.peso}
                      onChange={(evento) =>
                        handleAlterarItem(
                          item.id,
                          "peso",
                          Number(evento.target.value) || 0
                        )
                      }
                    />
                  </td>
                  <td className="inventario-coluna-equipado">
                    {podeEquipar ? (
                      <input
                        type="checkbox"
                        checked={Boolean(item.equipado)}
                        onChange={(evento) =>
                          handleAlterarItem(
                            item.id,
                            "equipado",
                            evento.target.checked
                          )
                        }
                        aria-label={`Equipar ${item.nome || "item"}`}
                      />
                    ) : (
                      <span className="inventario-nao-aplica">—</span>
                    )}
                  </td>
                  <td>
                    {item.tipoItem === "arma" ? (
                      <select
                        value={item.atributoAtaque ?? "auto"}
                        onChange={(evento) =>
                          handleAlterarItem(
                            item.id,
                            "atributoAtaque",
                            evento.target.value
                          )
                        }
                      >
                        <option value="auto">Automático</option>
                        <option value="forca">Força</option>
                        <option value="destreza">Destreza</option>
                      </select>
                    ) : (
                      <span className="inventario-nao-aplica">—</span>
                    )}
                  </td>


                    <td className="inventario-coluna-magico">
  <label className="inventario-magico-checkbox">
    <input
      type="checkbox"
      checked={Boolean(item.magico)}
      onChange={(evento) =>
        handleAlterarItem(item.id, "magico", evento.target.checked)
      }
      aria-label={`${item.nome || "Item"} é mágico`}
    />
    ✨
  </label>

  {item.magico && (
    <div className="inventario-magico-detalhes">
      <select
        value={item.raridade ?? "comum"}
        onChange={(evento) =>
          handleAlterarItem(item.id, "raridade", evento.target.value)
        }
        aria-label={`Raridade de ${item.nome || "item"}`}
      >
        {RARIDADES.map((raridade) => (
          <option key={raridade.id} value={raridade.id}>
            {raridade.label}
          </option>
        ))}
      </select>
      <input
        type="number"
        className="inventario-input-numero inventario-bonus-magico"
        value={item.bonusMagico ?? 0}
        onChange={(evento) =>
          handleAlterarItem(
            item.id,
            "bonusMagico",
            Number(evento.target.value) || 0
          )
        }
        title={
          item.tipoItem === "arma"
            ? "Bônus mágico: soma no acerto e no dano quando equipada"
            : item.tipoItem === "armadura"
            ? "Bônus mágico: soma na CA quando equipada"
            : "Bônus mágico: só informativo pra esse tipo de item — aplique manualmente onde fizer sentido"
        }
        aria-label={`Bônus mágico de ${item.nome || "item"}`}
      />
    </div>
  )}
</td>

                  <td>
                    <button
                      type="button"
                      className="inventario-remover"
                      onClick={() => handleRemoverItem(item.id)}
                      aria-label={`Remover ${item.nome || "item"}`}
                    >
                      ×
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      )}

      <button
        type="button"
        className="inventario-adicionar"
        onClick={handleAdicionarItem}
      >
        + Item personalizado
      </button>
    </section>
  );
}
