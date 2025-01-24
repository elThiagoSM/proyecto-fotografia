import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import LightGallery from "lightgallery/react";
import "lightgallery/css/lightgallery.css";
import "lightgallery/css/lg-thumbnail.css";
import "lightgallery/css/lg-zoom.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

// Plugins
import lgThumbnail from "lightgallery/plugins/thumbnail";
import lgZoom from "lightgallery/plugins/zoom";

const ViewAlbum = () => {
  const { usuario, id_album, titulo_album } = useParams();
  const [photos, setPhotos] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchPhotos = async () => {
      try {
        const response = await fetch(
          `http://localhost:5000/photos/${id_album}`
        );
        const data = await response.json();

        if (response.ok && data.success) {
          setPhotos(data.photos || []);
        } else {
          setError(
            data.message || "No se pudo cargar la información del álbum."
          );
        }
      } catch (err) {
        console.error("Error al obtener las fotos:", err);
        setError("Error al conectar con el servidor. Inténtalo más tarde.");
      } finally {
        setLoading(false);
      }
    };

    fetchPhotos();
  }, [id_album]);

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-screen bg-gray-100">
        <div className="spinner-border animate-spin inline-block w-8 h-8 border-4 rounded-full text-blue-500"></div>
        <p className="ml-3 text-blue-500">Cargando fotos...</p>
      </div>
    );
  }

  if (error) {
    return <div className="text-center text-red-500 py-16">{error}</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      {/* Header */}
      <Header />
      <div className="container mx-auto max-w-7xl">
        <div className="container mx-auto p-6">
          <div className="text-center mb-8">
            <h1 className="text-4xl font-bold text-gray-800">{titulo_album}</h1>
            <p className="text-gray-600 italic">Álbum creado por {usuario}</p>
          </div>

          {photos.length > 0 ? (
            <LightGallery
              speed={500}
              plugins={[lgThumbnail, lgZoom]}
              elementClassNames="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4"
            >
              {photos.map((photo, index) => (
                <a
                  key={index}
                  href={photo.url}
                  data-lg-size="800-1400" // Ajustado para reflejar la proporción 1:2
                  data-sub-html={photo.caption || ""}
                  className="block overflow-hidden rounded-lg hover:shadow-lg transition-all"
                >
                  <img
                    src={photo.url}
                    alt={photo.caption || `Imagen ${index + 1}`}
                    className="w-full h-auto aspect-[2/3] object-cover"
                  />
                </a>
              ))}
            </LightGallery>
          ) : (
            <p className="text-gray-600 text-center">
              No hay fotos en este álbum.
            </p>
          )}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default ViewAlbum;
