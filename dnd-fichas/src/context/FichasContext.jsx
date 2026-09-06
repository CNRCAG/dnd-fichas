import { useEffect, useState } from "react";
import { carregarFichas, salvarFichas } from "../utils/storage";
import { criarFichaVazia } from "../utils/ficha";
import { FichasContext } from "./fichasContext";

export function FichasProvider({ children }) {
  const [fichas, setFichas] = useState(() => carregarFichas() ?? []);

  // Toda mudança na lista de fichas é persistida automaticamente.
  useEffect(() => {
    salvarFichas(fichas);
  }, [fichas]);

  function criarFicha(nome, overrides = {}) {
    const novaFicha = { ...criarFichaVazia(nome), ...overrides };
    setFichas((atual) => [...atual, novaFicha]);
    return novaFicha;
  }

  function atualizarFicha(id, atualizador) {
    setFichas((atual) =>
      atual.map((ficha) =>
        ficha.id === id ? { ...ficha, ...atualizador(ficha) } : ficha
      )
    );
  }

  function removerFicha(id) {
    setFichas((atual) => atual.filter((ficha) => ficha.id !== id));
  }

  function obterFicha(id) {
    return fichas.find((ficha) => ficha.id === id);
  }

  const valor = {
    fichas,
    criarFicha,
    atualizarFicha,
    removerFicha,
    obterFicha,
  };

  return (
    <FichasContext.Provider value={valor}>{children}</FichasContext.Provider>
  );
}
