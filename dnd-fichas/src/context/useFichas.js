import { useContext } from "react";
import { FichasContext } from "./fichasContext";

export function useFichas() {
  const contexto = useContext(FichasContext);
  if (!contexto) {
    throw new Error("useFichas precisa ser usado dentro de um FichasProvider");
  }
  return contexto;
}
