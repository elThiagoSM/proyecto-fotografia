import React from "react";
import { FaUserCircle } from "react-icons/fa";

const Header = () => {
  const loggedInUser = JSON.parse(sessionStorage.getItem("user"));

  return (
    <header className="bg-white shadow-md py-4 sticky top-0 z-50">
      <div className="container mx-auto flex justify-between items-center px-6 max-w-7xl">
        <h1 className="text-3xl font-bold text-gray-800">Fotografía Pro</h1>
        <nav className="flex space-x-6 items-center">
          <a href="/" className="text-gray-700 hover:text-blue-500 transitionn">
            Inicio
          </a>
          {loggedInUser ? (
            <a
              href={`/${loggedInUser.nombre_usuario}`}
              className="flex items-center space-x-2 hover:opacity-80 transition"
            >
              <img
                src={loggedInUser.foto_perfil}
                alt="Foto de perfil"
                className="w-10 h-10 rounded-full object-cover"
              />
            </a>
          ) : (
            <a
              href="/login"
              className="text-4xl text-blue-500 pl-2 py-2 hover:text-indigo-600 rounded transition"
            >
              <FaUserCircle />
            </a>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;
