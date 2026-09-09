import { Routes, Route } from "react-router-dom";
import Topbar from "./components/layout/Topbar";
import Footer from "./components/layout/Footer";
import Home from "./pages/Home";
import Ficha from "./pages/Ficha";
import NovaFicha from "./pages/NovaFicha";
import PainelRolagens from "./components/rolagem/PainelRolagens";

export default function App() {
  return (
    <div className="app-shell">
      <Topbar />
      <main className="app-main">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/ficha/:id" element={<Ficha />} />
          <Route path="/nova" element={<NovaFicha />} />
        </Routes>
      </main>
      <Footer />
      <PainelRolagens />
    </div>
  );
}
