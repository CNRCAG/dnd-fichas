import { useRef, useState } from "react";
import { carregarFichas, salvarFichas } from "../utils/storage";
import { criarFichaVazia, normalizarFicha } from "../utils/ficha";
import { sincronizarFichaComSubclasses } from "../utils/subclassesFicha";
import { reconciliarEstadoProntidao } from "../utils/validacaoFicha";
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
    return reconciliarEstadoProntidao(normalizada, atributosTotais);
  };

  const [estadoInicial] = useState(() => {
    const fichasCarregadas = (carregarFichas() ?? []).map(sincronizarFicha);
    const resultado = salvarFichas(fichasCarregadas);
    return {
      fichas: fichasCarregadas,
      falhaPersistencia: resultado.ok
        ? null
        : { ...resultado.erro, ocorridoEm: Date.now() },
    };
  });
  const [fichas, setFichas] = useState(estadoInicial.fichas);
  const fichasRef = useRef(estadoInicial.fichas);
  const [falhaPersistencia, setFalhaPersistencia] = useState(
    estadoInicial.falhaPersistencia
  );

  function registrarResultadoPersistencia(resultado) {
    if (resultado.ok) {
      setFalhaPersistencia(null);
      return true;
    }
    setFalhaPersistencia({
      ...resultado.erro,
      ocorridoEm: Date.now(),
    });
    return false;
  }

  function substituirFichas(proximasFichas) {
    fichasRef.current = proximasFichas;
    setFichas(proximasFichas);
    registrarResultadoPersistencia(salvarFichas(proximasFichas));
  }

  function tentarSalvarNovamente() {
    return registrarResultadoPersistencia(salvarFichas(fichasRef.current));
  }

  function dispensarFalhaPersistencia() {
    setFalhaPersistencia(null);
  }

  function criarFicha(nome, overrides = {}) {
    const novaFicha = sincronizarFicha({ ...criarFichaVazia(nome), ...overrides });
    substituirFichas([...fichasRef.current, novaFicha]);
    return novaFicha;
  }

  function atualizarFicha(id, atualizador) {
    substituirFichas(
      fichasRef.current.map((ficha) =>
        ficha.id === id
          ? sincronizarFicha({ ...ficha, ...atualizador(ficha) })
          : ficha
      )
    );
  }

  function removerFicha(id) {
    substituirFichas(fichasRef.current.filter((ficha) => ficha.id !== id));
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
    falhaPersistencia,
    tentarSalvarNovamente,
    dispensarFalhaPersistencia,
  };

  return (
    <FichasContext.Provider value={valor}>{children}</FichasContext.Provider>
  );
}
