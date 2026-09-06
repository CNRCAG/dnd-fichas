import { useState } from "react";
import { RolagemContext } from "./rolagemContext";

const LIMITE_HISTORICO = 20;

export function RolagemProvider({ children }) {
  const [rolagens, setRolagens] = useState([]);

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

  return (
    <RolagemContext.Provider value={{ rolagens, registrarRolagem, limparHistorico }}>
      {children}
    </RolagemContext.Provider>
  );
}
