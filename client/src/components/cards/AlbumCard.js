import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  FaTrashAlt,
  FaEdit,
  FaUpload,
  FaLock,
  FaLockOpen,
} from "react-icons/fa";
import EditAlbumModal from "../modals/EditAlbumModal";
import ConfirmationModal from "../modals/ConfirmationModal";

const AlbumCard = ({ album, onDelete }) => {
  const [showConfirm, setShowConfirm] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const navigate = useNavigate();

  const loggedInUser = JSON.parse(
    sessionStorage.getItem("user")
  )?.nombre_usuario;

  const handleOpenAlbum = () => {
    const formattedTitle = album.titulo.replace(/ /g, "-").toLowerCase();
    navigate(`/${loggedInUser}/albums/${album.id}/${formattedTitle}`);
  };

  return (
    <div className="border-2 rounded-lg overflow-hidden bg-gradient-to-b from-gray-100 to-gray-200 flex flex-col transition">
      {/* Imagen de portada */}
      <div className="h-56 overflow-hidden relative">
        <img
          src={album.url_portada || "https://i.ibb.co/yptyWJv/not-image.jpg"}
          alt={album.titulo}
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-0 left-0 text-gray-900 p-4 w-full">
          <h2 className="text-xl font-bold truncate">{album.titulo}</h2>
        </div>
      </div>

      {/* Contenido del álbum */}
      <div className="p-5 flex flex-col justify-between flex-grow">
        <div>
          <p className="text-gray-600 text-sm mb-2">
            Creado el: {new Date(album.fecha_creacion).toLocaleDateString()}
          </p>
          <p className="text-gray-600 text-sm mb-2">
            Tema: {album.tema || "Sin tema"}
          </p>
          <div className="flex items-center gap-2 text-sm mb-4">
            {album.publico ? (
              <FaLockOpen className="text-green-600" title="Público" />
            ) : (
              <FaLock className="text-red-600" title="Privado" />
            )}
            <span className={album.publico ? "text-green-600" : "text-red-600"}>
              {album.publico ? "Público" : "Privado"}
            </span>
          </div>
        </div>

        {/* Botones de acciones */}
        <div className="grid grid-cols-3 gap-2">
          <button
            className="flex items-center justify-center gap-2 bg-blue-600 text-white px-3 py-2 rounded hover:bg-blue-700 transition"
            onClick={() => setIsEditModalOpen(true)}
          >
            <FaEdit />
            Editar
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-indigo-600 text-white px-3 py-2 rounded hover:bg-indigo-700 transition"
            onClick={handleOpenAlbum}
          >
            <FaUpload />
            Subir
          </button>

          <button
            className="flex items-center justify-center gap-2 bg-red-600 text-white px-3 py-2 rounded hover:bg-red-700 transition"
            onClick={() => setShowConfirm(true)}
          >
            <FaTrashAlt />
            Eliminar
          </button>
        </div>
      </div>

      {/* Modal de confirmación para eliminar */}
      {showConfirm && (
        <ConfirmationModal
          title="¿Eliminar álbum?"
          message="Esta acción no se puede deshacer."
          onConfirm={() => {
            onDelete(album.id);
            setShowConfirm(false);
          }}
          onCancel={() => setShowConfirm(false)}
        />
      )}

      {/* Modal para editar el álbum */}
      {isEditModalOpen && (
        <EditAlbumModal
          album={album}
          onClose={() => setIsEditModalOpen(false)}
        />
      )}
    </div>
  );
};

export default AlbumCard;
