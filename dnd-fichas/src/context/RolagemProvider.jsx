import { useState } from "react";
import { RolagemContext } from "./rolagemContext";
import { rolarTesteD20 } from "../utils/dados";

const LIMITE_HISTORICO = 20;

export function RolagemProvider({ children }) {
  const [rolagens, setRolagens] = useState([]);
  const [vantagem, setVantagem] = useState(false);
  const [desvantagem, setDesvantagem] = useState(false);

  // titulo: string (ex: "Teste de Força"), resultado: objeto vindo de
  // rolarTesteD20 ou rolarFormula (ver src/utils/dados.js).
  function registrarRolagem(titulo, resultado, tipo) {
    const nova = {
      id: crypto.randomUUID(),
      titulo,
      resultado,
      tipo, // "d20" ou "formula"
      horario: Date.now(),
    };
    setRolagens((atual) => [nova, ...atual].slice(0, LIMITE_HISTORICO));
  }

  function limparHistorico() {
    setRolagens([]);
  }

  function rolarD20(modificador = 0) {
    return rolarTesteD20(modificador, { vantagem, desvantagem });
  }

  return (
    <RolagemContext.Provider value={{
      rolagens,
      registrarRolagem,
      limparHistorico,
      vantagem,
      desvantagem,
      setVantagem,
      setDesvantagem,
      rolarD20,
    }}>
      {children}
    </RolagemContext.Provider>
  );
}
