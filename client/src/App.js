import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import Albums from "./pages/Albums";
import PhotographerProfile from "./pages/PhotographerProfile";
import VerifyEmail from "./pages/VerifyEmail";
import AlbumDetails from "./pages/AlbumDetails";
import ViewAlbum from "./pages/ViewAlbum";
import PrivateRoute from "./components/PrivateRoute";
import { Analytics } from "@vercel/analytics/react";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />

        {/* Ruta pública para acceder al perfil del fotógrafo */}
        <Route path="/:usuario" element={<PhotographerProfile />} />

        {/* Ruta protegida (solo accesible si el usuario está autenticado) */}
        <Route element={<PrivateRoute />}>
          <Route path="/:usuario/albums" element={<Albums />} />
          <Route
            path="/:usuario/albums/:id_album/:titulo_album"
            element={<AlbumDetails />}
          />
        </Route>

        <Route
          path="/:usuario/view-album/:id_album/:titulo_album"
          element={<ViewAlbum />}
        />

        <Route path="/verify-email" element={<VerifyEmail />} />
      </Routes>

      <Analytics />
    </Router>
  );
}

export default App;
