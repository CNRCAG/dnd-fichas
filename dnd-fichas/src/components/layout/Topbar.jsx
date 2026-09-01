import { NavLink, useMatch } from "react-router-dom";
import { useFichas } from "../../context/useFichas";
import "./Topbar.css";

export default function Topbar() {
  const match = useMatch("/ficha/:id");
  const { obterFicha } = useFichas();
  const fichaAtual = match ? obterFicha(match.params.id) : null;

  return (
    <header className="topbar">
      <NavLink to="/" className="topbar-brand">
        <span className="topbar-titulo">D&amp;D Fichas</span>
      </NavLink>

      <nav className="topbar-nav">
        <NavLink
          to="/"
          end
          className={({ isActive }) =>
            isActive ? "topbar-link is-active" : "topbar-link"
          }
        >
          Início
        </NavLink>
        {fichaAtual && (
          <span className="topbar-ficha-atual">{fichaAtual.nome}</span>
        )}
      </nav>
    </header>
  );
}
