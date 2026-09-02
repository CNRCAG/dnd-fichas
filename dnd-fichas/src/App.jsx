import { Routes, Route } from "react-router-dom";
import Topbar from "./components/layout/Topbar";
import Home from "./pages/Home";
import Ficha from "./pages/Ficha";
import NovaFicha from "./pages/NovaFicha";

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
    </div>
  );
}
