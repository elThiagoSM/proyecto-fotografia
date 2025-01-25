import React, { useState } from "react";
import { FaTrashAlt, FaEdit } from "react-icons/fa";
import PhotoDetailsModal from "../modals/PhotoDetailsModal";
import ConfirmationModal from "../modals/ConfirmationModal";

const ImageCard = ({ photo, onDelete }) => {
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isConfirmModalOpen, setIsConfirmModalOpen] = useState(false);

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const handleOpenEditModal = () => {
    setIsEditModalOpen(true);
  };

  const handleCloseEditModal = () => {
    setIsEditModalOpen(false);
  };

  const handleOpenConfirmModal = () => {
    setIsConfirmModalOpen(true);
  };

  const handleCloseConfirmModal = () => {
    setIsConfirmModalOpen(false);
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`${API_BASE_URL}/photos/${photo.id}`, {
        method: "DELETE",
      });
      const data = await response.json();

      if (data.success) {
        // Llama la función onDelete para actualizar la lista de fotos en el estado principal
        onDelete(photo.id);
      } else {
        console.error("Error al eliminar la foto:", data.message);
      }
    } catch (error) {
      console.error("Error en el proceso de eliminación:", error);
    } finally {
      handleCloseConfirmModal();
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 max-w-60 mx-auto">
      <div className="relative">
        <img
          src={photo.url}
          alt={photo.titulo}
          className="w-full aspect-[3/4] object-cover"
        />
        <div className="absolute bottom-2 right-2 bg-black bg-opacity-50 text-white text-xs px-2 py-1 rounded">
          ${photo.precio}
        </div>
      </div>
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-800 truncate">
          {photo.titulo}
        </h3>
        <p className="text-sm text-gray-500">
          Subida el:{" "}
          <span className="font-medium">
            {new Date(photo.fecha_subida).toLocaleDateString()}
          </span>
        </p>
        {/* Botones de acciones */}
        <div className="grid grid-cols-2 gap-2">
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
            onClick={handleOpenEditModal}
          >
            <FaEdit />
            Editar
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
            onClick={handleOpenConfirmModal}
          >
            <FaTrashAlt />
            Eliminar
          </button>
        </div>
      </div>

      {/* Modal para editar detalles */}
      <PhotoDetailsModal
        isOpen={isEditModalOpen}
        onClose={handleCloseEditModal}
        photo={photo}
      />

      {/* Modal de confirmación */}
      {isConfirmModalOpen && (
        <ConfirmationModal
          title="Eliminar Imagen"
          message="¿Estás seguro de que deseas eliminar esta imagen? Esta acción no se puede deshacer."
          onConfirm={handleDelete}
          onCancel={handleCloseConfirmModal}
        />
      )}
    </div>
  );
};

export default ImageCard;
