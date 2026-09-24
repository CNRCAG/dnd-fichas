import { useEffect, useRef } from "react";

const FOCUSABLE = [
  "a[href]",
  "button:not([disabled])",
  "input:not([disabled])",
  "select:not([disabled])",
  "textarea:not([disabled])",
  "[tabindex]:not([tabindex='-1'])",
].join(",");

export function useModalA11y(aberto, onFechar) {
  const dialogRef = useRef(null);
  const onFecharRef = useRef(onFechar);

  useEffect(() => {
    onFecharRef.current = onFechar;
  }, [onFechar]);

  useEffect(() => {
    if (!aberto || !dialogRef.current) return undefined;

    const dialog = dialogRef.current;
    const focoAnterior = document.activeElement;
    const elementos = () => [...dialog.querySelectorAll(FOCUSABLE)];
    (elementos()[0] ?? dialog).focus();

    function handleKeyDown(evento) {
      if (evento.key === "Escape") {
        evento.preventDefault();
        onFecharRef.current();
        return;
      }

      if (evento.key !== "Tab") return;
      const focaveis = elementos();
      if (focaveis.length === 0) {
        evento.preventDefault();
        dialog.focus();
        return;
      }

      const primeiro = focaveis[0];
      const ultimo = focaveis[focaveis.length - 1];
      if (evento.shiftKey && document.activeElement === primeiro) {
        evento.preventDefault();
        ultimo.focus();
      } else if (!evento.shiftKey && document.activeElement === ultimo) {
        evento.preventDefault();
        primeiro.focus();
      }
    }

    document.addEventListener("keydown", handleKeyDown);
    return () => {
      document.removeEventListener("keydown", handleKeyDown);
      focoAnterior?.focus?.();
    };
  }, [aberto]);

  return dialogRef;
}
