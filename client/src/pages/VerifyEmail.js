import React, { useState } from "react";

const VerifyEmail = () => {
  const [email, setEmail] = useState("");
  const [codigo, setCodigo] = useState("");
  const [mensaje, setMensaje] = useState("");

  const handleVerification = async (event) => {
    event.preventDefault();

    try {
      const response = await fetch("http://localhost:5000/auth/verify-email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, codigo }),
      });

      const result = await response.json();

      if (result.success) {
        setMensaje(result.message);
        setEmail("");
        setCodigo("");
      } else {
        setMensaje(result.message);
      }
    } catch (error) {
      console.error("Error:", error);
      setMensaje("Error al verificar el correo. Inténtalo de nuevo.");
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 text-gray-800 flex items-center justify-center">
      <div className="w-full max-w-md bg-white p-8 rounded-lg shadow-lg">
        <h2 className="text-3xl font-semibold text-center text-blue-600 mb-6">
          Verifica tu correo
        </h2>
        <form className="space-y-4" onSubmit={handleVerification}>
          <input
            type="email"
            placeholder="Correo electrónico"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <input
            type="text"
            placeholder="Código de verificación"
            value={codigo}
            onChange={(e) => setCodigo(e.target.value)}
            className="w-full px-4 py-2 bg-gray-50 rounded-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500"
            required
          />
          <button
            type="submit"
            className="w-full bg-blue-500 text-white py-2 rounded-lg hover:bg-indigo-600 transition"
          >
            Verificar
          </button>
        </form>
        {mensaje && <p className="text-center text-red-600 mt-4">{mensaje}</p>}
      </div>
    </div>
  );
};

export default VerifyEmail;
