import React, { useState, useEffect } from "react";
import { Helmet } from "react-helmet";
import { useParams, useNavigate } from "react-router-dom";
import { FaPlus, FaCog } from "react-icons/fa";
import { VscVerifiedFilled } from "react-icons/vsc";
import Header from "../components/Header";
import Footer from "../components/Footer";
import EditProfileModal from "../components/modals/EditProfileModal";
import SettingsModal from "../components/modals/SettingsModal";
import ContactsModal from "../components/modals/ContactsModal";
import AlbumProfileCard from "../components/cards/AlbumProfileCard";

const PhotographerProfile = () => {
  const { usuario } = useParams();
  const navigate = useNavigate();
  const [showEditProfile, setShowEditProfile] = useState(false);
  const [showSettingsModal, setShowSettingsModal] = useState(false);
  const [showContactsModal, setShowContactsModal] = useState(false);
  const [photographer, setPhotographer] = useState(null);
  const [filteredAlbums, setFilteredAlbums] = useState([]);
  const [error, setError] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  const loggedInUserId = JSON.parse(sessionStorage.getItem("user"))?.id;

  useEffect(() => {
    const fetchPhotographerData = async () => {
      try {
        // Fetch datos del usuario
        const userResponse = await fetch(`${API_BASE_URL}/usuario/${usuario}`);
        const userData = await userResponse.json();

        if (userResponse.ok && userData.success) {
          setPhotographer(userData.user);

          // Una vez que se obtiene el fotógrafo, realizar la solicitud de álbumes
          const albumsResponse = await fetch(
            `${API_BASE_URL}/albums/publicos/${userData.user.id}` // Usar el id del usuario
          );
          const albumsData = await albumsResponse.json();

          if (albumsResponse.ok && albumsData.success) {
            setFilteredAlbums(albumsData.albums || []);
          } else {
            setError(
              albumsData.message ||
                "No se pudo cargar la información de los álbumes."
            );
          }
        } else {
          setError(
            userData.message ||
              "No se pudo cargar la información del fotógrafo."
          );
        }
      } catch (err) {
        console.error("Error al obtener los datos:", err);
        setError(
          "Error al conectar con el servidor. Por favor, inténtalo más tarde."
        );
      }
    };

    fetchPhotographerData();
  }, [usuario]);

  if (error) {
    return <div className="text-center text-red-500 py-16">{error}</div>;
  }

  if (!photographer) {
    return <div className="text-center text-gray-500 py-16">Cargando...</div>;
  }

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Helmet>
        <title>{`${photographer.nombre_completo} | Perfil de Fotógrafo`}</title>
        <meta
          name="description"
          content={`Descubre el perfil de ${photographer.nombre_completo}, un fotógrafo especializado en ${photographer.tipo}. Conoce su trabajo y álbumes publicados.`}
        />
        <meta
          property="og:title"
          content={`${photographer.nombre_completo} | Perfil de Fotógrafo`}
        />
        <meta
          property="og:description"
          content={`Explora los álbumes y proyectos de ${photographer.nombre_completo}, un fotógrafo verificado en nuestra plataforma.`}
        />
        <meta
          property="og:image"
          content={photographer.foto_perfil || "https://placehold.co/200x200"}
        />
        <meta property="og:url" content={window.location.href} />
        <meta name="twitter:card" content="summary_large_image" />
      </Helmet>

      {/* Modal para Editar Perfil */}
      {showEditProfile && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <EditProfileModal
            photographer={photographer}
            onClose={() => setShowEditProfile(false)}
          />
        </div>
      )}
      {showSettingsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <SettingsModal
            usuarioId={loggedInUserId}
            onClose={() => setShowSettingsModal(false)}
          />
        </div>
      )}

      {showContactsModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <ContactsModal
            usuarioId={photographer.id}
            onClose={() => setShowContactsModal(false)}
          />
        </div>
      )}
      {/* Header */}
      <Header />

      {/* Sección de Perfil del Fotógrafo */}
      <section className="relative">
        <div className="bg-blue-500 h-32 py-40"></div>

        <div className="absolute inset-x-0 top-3/4 transform -translate-y-1/2 bg-white text-gray-900 py-12 max-w-5xl mx-auto rounded-lg shadow-lg">
          <div className="relative container mx-auto flex flex-col md:flex-row items-center px-5">
            {/* Imagen del Fotógrafo */}
            <div className="w-1/5 text-center mb-4 md:mb-0">
              <img
                src={photographer.foto_perfil || "https://placehold.co/200x200"}
                alt={photographer.nombre_completo}
                className="w-36 h-36 rounded-full mx-auto object-cover"
              />
            </div>

            {/* Información y Botones */}
            <div className="md:w-4/5 px-0 sm:px-5">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-2xl font-bold">
                  <p className="text-sm text-gray-500">{photographer.tipo}</p>
                  {photographer.nombre_completo}
                </h2>

                {/* Botones */}
                <div className="hidden md:flex space-x-2">
                  <button
                    className="bg-gray-200 px-3 py-1 rounded text-sm text-gray-900 hover:bg-gray-300 transition"
                    onClick={() =>
                      navigator.share({
                        title: photographer.nombre_completo,
                        url: window.location.href,
                      })
                    }
                  >
                    Compartir perfil
                  </button>
                  {loggedInUserId === photographer.id ? (
                    <>
                      <button
                        className="bg-gray-200 px-3 py-1 rounded text-sm text-gray-900 hover:bg-gray-300 transition"
                        onClick={() => setShowEditProfile(true)}
                      >
                        Editar perfil
                      </button>
                      <button
                        className="text-gray-900 text-lg p-1 hover:text-blue-500 transition"
                        onClick={() => setShowSettingsModal(true)}
                      >
                        <FaCog />
                      </button>
                    </>
                  ) : (
                    <button
                      className="bg-gray-200 px-3 py-1 rounded text-sm text-gray-900 hover:bg-gray-300 transition"
                      onClick={() => setShowContactsModal(true)}
                    >
                      Contactar
                    </button>
                  )}
                </div>
              </div>

              {/* Usuario y biografía */}
              <div className="space-y-1">
                <p className="text-sm font-bold flex">
                  @{photographer.nombre_usuario}
                  {photographer.verificado ? (
                    <span className="flex flex-col justify-center text-center text-lg text-blue-500 ml-1">
                      <VscVerifiedFilled />
                    </span>
                  ) : null}
                </p>

                <p className="text-sm max-w-sm">
                  {photographer.biografia || "No hay biografía"}
                </p>
                <p className="text-sm">
                  {filteredAlbums.length} álbumes publicados
                </p>
              </div>

              {/* Botones en pantallas pequeñas */}
              <div className="flex md:hidden flex-wrap gap-2 mt-4">
                <button
                  className="flex-1 bg-gray-200 px-3 py-2 rounded text-sm text-gray-900 hover:bg-gray-300 transition"
                  onClick={() =>
                    navigator.share({
                      title: photographer.nombre_completo,
                      url: window.location.href,
                    })
                  }
                >
                  Compartir perfil
                </button>
                {loggedInUserId === photographer.id ? (
                  <>
                    <button
                      className="flex-1 bg-gray-200 px-3 py-2 rounded text-sm text-gray-900 hover:bg-gray-300 transition"
                      onClick={() => setShowEditProfile(true)}
                    >
                      Editar perfil
                    </button>
                    <button
                      className="flex-1 text-gray-900 text-lg p-2 hover:text-blue-500 transition"
                      onClick={() => setShowSettingsModal(true)}
                    >
                      <FaCog />
                    </button>
                  </>
                ) : (
                  <button
                    className="flex-1 bg-gray-200 px-3 py-2 rounded text-sm text-gray-900 hover:bg-gray-300 transition"
                    onClick={() => setShowContactsModal(true)}
                  >
                    Contactar
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Álbumes Section */}
      <section className="py-10 sm:py-16 bg-gray-50 pt-20 sm:pt-40">
        <div className="container mx-auto px-4 sm:px-0 max-w-7xl">
          <h3 className="text-2xl sm:text-4xl font-bold text-center text-gray-800 mb-8 sm:mb-12">
            Álbumes
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 sm:gap-12">
            {filteredAlbums.length > 0 ? (
              filteredAlbums.map((album) => (
                <AlbumProfileCard
                  key={album.id}
                  album={album}
                  usuario={photographer.nombre_usuario}
                />
              ))
            ) : (
              <p className="text-gray-600 text-center">
                No hay álbumes disponibles.
              </p>
            )}
          </div>
        </div>
      </section>

      {loggedInUserId === photographer.id && (
        <button
          className="fixed bottom-6 right-6 bg-blue-500 text-white p-4 rounded-full shadow-lg hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-300"
          onClick={() => navigate(`/${photographer.nombre_usuario}/albums`)}
        >
          <FaPlus className="text-xl" />
        </button>
      )}

      <Footer />
    </div>
  );
};

export default PhotographerProfile;
