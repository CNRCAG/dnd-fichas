import { useEffect, useState } from "react";
import { carregarFichas, salvarFichas } from "../utils/storage";
import { criarFichaVazia, normalizarFicha } from "../utils/ficha";
import { sincronizarFichaComSubclasses } from "../utils/subclassesFicha";
import { validarFicha } from "../utils/validacaoFicha";
import { obterRaca } from "../data/racas";
import { FichasContext } from "./fichasContext";

export function FichasProvider({ children }) {
  const sincronizarFicha = (ficha) => {
    const normalizada = sincronizarFichaComSubclasses(normalizarFicha(ficha));
    const raca = obterRaca(normalizada.racaId);
    const bonus = { ...(raca?.bonusAtributos ?? {}) };
    for (const atributo of normalizada.bonusRacialEscolhido ?? []) {
      if (atributo) bonus[atributo] = (bonus[atributo] ?? 0) + 1;
    }
    const atributosTotais = Object.fromEntries(Object.entries(normalizada.atributos ?? {}).map(([chave, valor]) => [chave, Number(valor) + (bonus[chave] ?? 0)]));
    const validacao = validarFicha(normalizada, atributosTotais);
    return normalizada.estadoFicha === "pronta" && !validacao.pronta
      ? { ...normalizada, estadoFicha: "rascunho" }
      : normalizada;
  };

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
