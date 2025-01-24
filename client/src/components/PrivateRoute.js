import React from "react";
import { Navigate, Outlet } from "react-router-dom";

const PrivateRoute = () => {
  // Verificar si el usuario está autenticado (basado en sessionStorage)
  const user = sessionStorage.getItem("user");

  // Si el usuario no está autenticado, redirigirlo a la página de login
  if (!user) {
    return <Navigate to="/login" />;
  }

  // Si está autenticado, renderizar el componente protegido
  return <Outlet />;
};

export default PrivateRoute;
