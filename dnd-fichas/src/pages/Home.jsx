import { useMemo, useState } from "react";
import { Link } from "react-router-dom";
import { useFichas } from "../context/useFichas";
import { obterClasse } from "../data/classes";
import "./Home.css";

export default function Home() {
  const { fichas, removerFicha } = useFichas();
  const [busca, setBusca] = useState("");

  const fichasFiltradas = useMemo(() => {
    const termo = busca.trim().toLowerCase();
    if (!termo) return fichas;
    return fichas.filter((ficha) => ficha.nome.toLowerCase().includes(termo));
  }, [fichas, busca]);

  function handleRemover(ficha) {
    if (window.confirm(`Excluir a ficha de ${ficha.nome}?`)) {
      removerFicha(ficha.id);
    }
  }

  return (
    <div>
      <div className="home-cabecalho">
        <h2 className="home-titulo">Aventureiros: {fichas.length}</h2>
        <Link to="/nova" className="home-nova-ficha">
          + Nova ficha
        </Link>
      </div>

      <input
        type="text"
        className="home-busca"
        placeholder="Buscar ficha..."
        value={busca}
        onChange={(evento) => setBusca(evento.target.value)}
      />

      {fichas.length === 0 ? (
        <p className="home-vazio">
          Você ainda não tem nenhuma ficha. <Link to="/nova">Crie a primeira</Link>.
        </p>
      ) : fichasFiltradas.length === 0 ? (
        <p className="home-vazio">Nenhuma ficha encontrada para "{busca}".</p>
      ) : (
        <div className="home-grid">
          {fichasFiltradas.map((ficha) => {
            const classe = obterClasse(ficha.classeId);
            return (
              <div key={ficha.id} className="ficha-card">
                <button
                  type="button"
                  className="ficha-card-remover"
                  onClick={() => handleRemover(ficha)}
                  aria-label={`Excluir ${ficha.nome}`}
                  title="Excluir ficha"
                >
                  ⚙
                </button>
                <div className="ficha-card-corpo">
                  <span className="ficha-card-nome">{ficha.nome}</span>
                  <span className="ficha-card-classe">
                    {classe ? classe.nome : "Sem classe"}
                  </span>
                  <span className="ficha-card-data">
                    {ficha.criadoEm
                      ? `Criada em ${new Date(ficha.criadoEm).toLocaleDateString("pt-BR")}`
                      : "Ficha antiga"}
                  </span>
                </div>
                <Link to={`/ficha/${ficha.id}`} className="ficha-card-acessar">
                  Acessar ficha
                </Link>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
