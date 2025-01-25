import React from "react";

const Register = () => {
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleRegister = async (event) => {
    event.preventDefault();

    const formData = new FormData(event.target);

    // Convertir FormData a JSON
    const data = Object.fromEntries(formData);

    try {
      const response = await fetch(`${API_BASE_URL}/auth/register`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      if (result.success) {
        alert(result.message);
        window.location.href = "/verify-email"; // Redirige a la página de verificación
        event.target.reset();
      } else {
        alert(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      alert("Error al procesar el registro. Por favor, inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Crea tu cuenta
        </h2>
        <form className="space-y-4" onSubmit={handleRegister}>
          {/* Nombre completo */}
          <input
            name="nombre_completo"
            type="text"
            placeholder="Nombre completo"
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Nombre de usuario */}
          <input
            name="nombre_usuario"
            type="text"
            placeholder="Nombre de usuario"
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Correo electrónico */}
          <input
            name="email"
            type="email"
            placeholder="Correo electrónico"
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Contraseña */}
          <input
            name="contrasena"
            type="password"
            placeholder="Contraseña"
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          {/* Tipo de usuario */}
          <select
            name="tipo"
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            defaultValue=""
            required
          >
            <option value="" disabled>
              Selecciona el tipo de usuario
            </option>
            <option value="cliente">Cliente</option>
            <option value="fotografo">Fotógrafo</option>
          </select>
          {/* Botón de registro */}
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Registrarse
          </button>
        </form>

        {/* Opciones de registro social */}
        <div className="mt-6">
          <p className="text-center text-gray-600 mb-4">O regístrate con</p>
          <div className="flex justify-center space-x-4">
            <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-200">
              <i className="fab fa-google text-blue-600"></i>
            </button>
            <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-200">
              <i className="fab fa-github text-gray-800"></i>
            </button>
            <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-200">
              <i className="fab fa-apple text-gray-800"></i>
            </button>
            <button className="p-2 bg-gray-200 rounded-full hover:bg-gray-200">
              <i className="fab fa-facebook text-blue-600"></i>
            </button>
          </div>
        </div>

        {/* Redirección a inicio de sesión */}
        <p className="text-center text-gray-600 mt-4">
          ¿Ya tienes una cuenta?{" "}
          <a href="/login" className="text-blue-600 hover:underline">
            Inicia sesión
          </a>
        </p>
      </div>
    </div>
  );
};

export default Register;
