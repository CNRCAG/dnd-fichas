import { useContext } from "react";
import { RolagemContext } from "./rolagemContext";

export function useRolagem() {
  const contexto = useContext(RolagemContext);
  if (!contexto) {
    throw new Error("useRolagem precisa ser usado dentro de um RolagemProvider");
  }
  return contexto;
}
