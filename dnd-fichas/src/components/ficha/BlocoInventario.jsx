import { useState } from "react";
import { criarItemVazio } from "../../utils/inventario";
import ModalCatalogoItens from "../modal/ModalCatalogoItens";
import "./BlocoInventario.css";

export default function BlocoInventario({ inventario, onChangeInventario }) {
  const [modalAberto, setModalAberto] = useState(false);
  const pesoTotal = inventario.reduce(
    (soma, item) => soma + item.quantidade * item.peso,
    0
  );

  function handleAdicionarItem() {
    onChangeInventario([...inventario, criarItemVazio()]);
  }

  function handleAdicionarDoCatalogo(item) {
    onChangeInventario([
      ...inventario,
      { id: crypto.randomUUID(), nome: item.nome, quantidade: 1, peso: item.peso },
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
        <span className="inventario-peso">Peso total: {pesoTotal} kg</span>
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
              <th aria-label="Remover"></th>
            </tr>
          </thead>
          <tbody>
            {inventario.map((item) => (
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
            ))}
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
