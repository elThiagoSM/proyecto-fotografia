import React, { useState, useEffect } from "react";

const AlbumModal = ({ isOpen, onClose, fetchAlbums }) => {
  const [titulo, setTitulo] = useState("");
  const [temaId, setTemaId] = useState("");
  const [publico, setPublico] = useState(false);
  const [temas, setTemas] = useState([]);

  const fetchTemas = async () => {
    try {
      const response = await fetch("http://localhost:5000/temas");
      const data = await response.json();
      if (data.success) {
        setTemas(data.temas);
      } else {
        console.error("Error al cargar los temas:", data.message);
      }
    } catch (error) {
      console.error("Error al cargar los temas:", error);
    }
  };

  const handleCreateAlbum = async () => {
    const loggedInUserId = JSON.parse(sessionStorage.getItem("user"))?.id;

    if (!titulo || !loggedInUserId) {
      alert("Por favor, ingresa todos los campos requeridos.");
      return;
    }

    try {
      const response = await fetch("http://localhost:5000/albums", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          usuario_id: loggedInUserId,
          titulo,
          tema_id: temaId || null,
          publico,
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Álbum creado exitosamente.");
        fetchAlbums();
        onClose();
      } else {
        alert(data.message || "Error al crear el álbum.");
      }
    } catch (error) {
      console.error("Error al crear el álbum:", error);
    }
  };

  useEffect(() => {
    if (isOpen) fetchTemas();
  }, [isOpen]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Crear Nuevo Álbum
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              placeholder="Título"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select
              value={temaId}
              onChange={(e) => setTemaId(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            >
              <option value="">Selecciona un tema</option>
              {temas.map((tema) => (
                <option key={tema.id} value={tema.id}>
                  {tema.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="publico"
              checked={publico}
              onChange={(e) => setPublico(e.target.checked)}
              className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
            />
            <label
              htmlFor="publico"
              className="text-sm font-medium text-gray-700"
            >
              ¿Es público?
            </label>
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={onClose}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleCreateAlbum}
          >
            Crear
          </button>
        </div>
      </div>
    </div>
  );
};

export default AlbumModal;
