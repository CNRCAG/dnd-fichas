import { useEffect, useState } from "react";
import { carregarFichas, salvarFichas } from "../utils/storage";
import { criarFichaVazia, normalizarFicha } from "../utils/ficha";
import { sincronizarFichaComSubclasses } from "../utils/subclassesFicha";
import { FichasContext } from "./fichasContext";

export function FichasProvider({ children }) {
  const sincronizarFicha = (ficha) =>
    sincronizarFichaComSubclasses(normalizarFicha(ficha));

  const [fichas, setFichas] = useState(() =>
    (carregarFichas() ?? []).map(sincronizarFicha)
  );

  // Toda mudança na lista de fichas é persistida automaticamente.
  useEffect(() => {
    salvarFichas(fichas);
  }, [fichas]);

  function criarFicha(nome, overrides = {}) {
    const novaFicha = sincronizarFicha({ ...criarFichaVazia(nome), ...overrides });
    setFichas((atual) => [...atual, novaFicha]);
    return novaFicha;
  }

  function atualizarFicha(id, atualizador) {
    setFichas((atual) =>
      atual.map((ficha) =>
        ficha.id === id ? sincronizarFicha({ ...ficha, ...atualizador(ficha) }) : ficha
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
