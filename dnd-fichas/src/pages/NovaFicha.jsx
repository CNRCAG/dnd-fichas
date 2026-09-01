import { useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { useFichas } from "../context/useFichas";

// Por enquanto "Nova ficha" só gera uma ficha zerada e já leva direto pra
// ela. Uma tela de criação com escolha de origem/classe fica pra depois.
export default function NovaFicha() {
  const { criarFicha } = useFichas();
  const navigate = useNavigate();
  const criouRef = useRef(false);

  useEffect(() => {
    if (criouRef.current) return;
    criouRef.current = true;

    const novaFicha = criarFicha();
    navigate(`/ficha/${novaFicha.id}`, { replace: true });
  }, [criarFicha, navigate]);

  return null;
}
