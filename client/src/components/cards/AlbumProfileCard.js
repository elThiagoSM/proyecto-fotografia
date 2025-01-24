import React from "react";
import { FaCamera } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

const formatDate = (isoDate) => {
  if (!isoDate) return "No especificada";
  const date = new Date(isoDate);
  return date.toLocaleDateString("es-ES", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
};

const AlbumProfileCard = ({ album, usuario }) => {
  const navigate = useNavigate();

  return (
    <div
      className="max-w-sm bg-white border border-gray-200 rounded-lg shadow-md overflow-hidden hover:shadow-lg transition-transform transform hover:scale-105 cursor-pointer"
      onClick={() =>
        navigate(`/${usuario}/view-album/${album.id}/${album.titulo}`)
      }
    >
      <div className="relative">
        <img
          src={album.url_portada}
          alt={album.titulo}
          className="w-full h-56 object-cover"
        />
        <div className="absolute inset-0 bg-black bg-opacity-25 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
          <FaCamera className="text-white text-4xl" />
        </div>
      </div>
      <div className="p-4">
        <h4 className="text-xl font-semibold text-gray-800 mb-2 truncate">
          {album.titulo}
        </h4>
        <div className="text-gray-600 text-sm">
          <p>
            <strong>Tema:</strong> {album.tema || "No especificado"}
          </p>
          <p className="mb-1">
            <strong>Fecha:</strong> {formatDate(album.fecha_creacion)}
          </p>
        </div>
      </div>
    </div>
  );
};

export default AlbumProfileCard;
