import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleLogin = async (event) => {
    event.preventDefault();
    setError("");

    const data = {
      email: event.target.email.value,
      contrasena: event.target.password.value,
    };

    try {
      const response = await fetch(`${API_BASE_URL}/auth/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        // Guardar la sesión en sessionStorage
        sessionStorage.setItem("user", JSON.stringify(result.user));
        // Redirigir a /nombre_usuario
        navigate(`/${result.user.nombre_usuario}`);
      } else {
        setError(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setError(
        "Error al procesar el inicio de sesión. Por favor, inténtalo de nuevo."
      );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Inicia sesión
        </h2>
        <form className="space-y-4" onSubmit={handleLogin}>
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            name="password"
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {error && <p className="text-red-500 text-sm">{error}</p>}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Iniciar sesión
          </button>
        </form>

        <p className="text-center text-gray-600 mt-4">
          ¿No tienes una cuenta?{" "}
          <a href="/register" className="text-blue-600 hover:underline">
            Regístrate
          </a>
        </p>
      </div>
    </div>
  );
};

export default Login;
