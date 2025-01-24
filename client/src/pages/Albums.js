import React, { useState, useEffect } from "react";
import AlbumModal from "../components/modals/AlbumModal";
import AlbumCard from "../components/cards/AlbumCard";
import Header from "../components/Header";

const Albums = () => {
  const [albums, setAlbums] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchAlbums = async () => {
    const loggedInUserId = JSON.parse(sessionStorage.getItem("user"))?.id;

    if (!loggedInUserId) {
      console.error("Usuario no identificado.");
      setError("Usuario no identificado.");
      return;
    }

    setLoading(true);
    setError(null);
    try {
      const response = await fetch(
        `http://localhost:5000/albums/${loggedInUserId}`
      );
      const data = await response.json();
      if (data.success) {
        setAlbums(data.albums);
      } else {
        setError(data.message || "Error al obtener los álbumes.");
      }
    } catch (error) {
      console.error("Error al obtener los álbumes:", error);
      setError(
        "Error al obtener los álbumes. Por favor, inténtalo de nuevo más tarde."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteAlbum = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/albums/${id}`, {
        method: "DELETE",
      });

      const data = await response.json();
      if (data.success) {
        alert("Álbum eliminado exitosamente.");
        fetchAlbums(); // Actualiza la lista de álbumes
      } else {
        alert(data.message || "Error al eliminar el álbum.");
      }
    } catch (error) {
      console.error("Error al eliminar el álbum:", error);
      alert(
        "Error al eliminar el álbum. Por favor, inténtalo de nuevo más tarde."
      );
    }
  };

  useEffect(() => {
    fetchAlbums();
  }, []);

  return (
    <div className="min-h-screen bg-gray-100">
      <Header />
      <div className="container mx-auto max-w-7xl">
        <div className="container mx-auto p-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-800">Mis Álbumes</h1>
            <button
              className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded shadow-md focus:outline-none focus:ring-2 focus:ring-blue-400"
              onClick={() => setIsModalOpen(true)}
            >
              Crear Álbum
            </button>
          </div>

          {loading ? (
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-gray-600">
                Cargando álbumes...
              </p>
            </div>
          ) : error ? (
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-red-500">{error}</p>
            </div>
          ) : albums.length === 0 ? (
            <div className="text-center py-10">
              <p className="text-lg font-semibold text-gray-600">
                No hay álbumes disponibles. ¡Crea uno nuevo!
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {albums.map((album) => (
                <AlbumCard
                  key={album.id}
                  album={album}
                  onDelete={handleDeleteAlbum}
                />
              ))}
            </div>
          )}

          <AlbumModal
            isOpen={isModalOpen}
            onClose={() => setIsModalOpen(false)}
            fetchAlbums={fetchAlbums}
          />
        </div>
      </div>
    </div>
  );
};

export default Albums;
