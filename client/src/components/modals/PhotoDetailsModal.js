import React, { useState, useEffect } from "react";

const PhotoDetailsModal = ({ isOpen, onClose, photo }) => {
  const [titulo, setNombre] = useState(photo?.titulo || "");
  const [precio, setPrecio] = useState(photo?.precio || "");

  const handleSaveDetails = async () => {
    if (!titulo || !precio) {
      alert("Por favor, ingresa todos los campos requeridos.");
      return;
    }

    try {
      const response = await fetch(`http://localhost:5000/photos/${photo.id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          titulo,
          precio: parseFloat(precio),
        }),
      });

      const data = await response.json();
      if (data.success) {
        alert("Detalles actualizados exitosamente.");
        onClose();
      } else {
        alert(data.message || "Error al actualizar los detalles.");
      }
    } catch (error) {
      console.error("Error al actualizar los detalles:", error);
    }
  };

  useEffect(() => {
    if (photo) {
      setNombre(photo.titulo || "");
      setPrecio(photo.precio || "");
    }
  }, [photo]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Editar Detalles de la Fotografía
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              titulo
            </label>
            <input
              type="text"
              placeholder="titulo de la fotografía"
              value={titulo}
              onChange={(e) => setNombre(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Precio
            </label>
            <input
              type="number"
              step="0.01"
              placeholder="Precio"
              value={precio}
              onChange={(e) => setPrecio(e.target.value)}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
            />
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
            onClick={handleSaveDetails}
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default PhotoDetailsModal;
