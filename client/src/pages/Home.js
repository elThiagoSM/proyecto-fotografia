import React, { useEffect } from "react";
import { Helmet } from "react-helmet";
import lightGallery from "lightgallery";
import "lightgallery/css/lightgallery.css";
import Header from "../components/Header";
import Footer from "../components/Footer";

const Home = () => {
  useEffect(() => {
    lightGallery(document.getElementById("lightgallery"), {
      selector: "a",
      download: false,
      zoom: true,
    });
  }, []);

  return (
    <div className="bg-gray-100 min-h-screen font-sans">
      <Helmet>
        <title>FlashCaptu | Compra y Venta de Fotografías Profesionales</title>
        <meta
          name="description"
          content="FlashCaptu es la plataforma ideal para fotógrafos y clientes. Crea perfiles únicos, organiza tus álbumes y vende tus fotos al precio que elijas."
        />
        <meta
          name="keywords"
          content="fotografía, venta de fotos, álbumes de fotos, fotógrafos profesionales, plataforma de fotógrafos, comprar fotos"
        />
        <meta name="author" content="FlashCaptu" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />

        {/* Metadatos para redes sociales */}
        <meta
          property="og:title"
          content="FlashCaptu | Compra y Venta de Fotografías Profesionales"
        />
        <meta
          property="og:description"
          content="Crea, organiza y comparte tus fotos profesionales con el mundo en FlashCaptu. Descubre fotógrafos destacados y encuentra la imagen perfecta."
        />
        <meta property="og:image" content="https://placehold.co/1200x630" />
        <meta property="og:url" content={window.location.href} />
        <meta property="og:type" content="website" />

        {/* Twitter Card */}
        <meta name="twitter:card" content="summary_large_image" />
        <meta
          name="twitter:title"
          content="FlashCaptu | Compra y Venta de Fotografías Profesionales"
        />
        <meta
          name="twitter:description"
          content="Crea perfiles únicos, vende tus fotos y encuentra imágenes de alta calidad en FlashCaptu."
        />
        <meta name="twitter:image" content="https://placehold.co/1200x630" />
      </Helmet>

      {/* Header */}
      <Header />

      {/* Hero Section */}
      <section className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white py-20">
        <div className="container mx-auto flex flex-col md:flex-row items-center px-6 max-w-7xl">
          <div className="md:w-1/2 text-center md:text-left">
            <h2 className="text-5xl font-bold leading-tight mb-6">
              Tu Fotografía, Más Profesional
            </h2>
            <p className="text-lg mb-8">
              Crea perfiles únicos, organiza tus fotos y comparte tu pasión con
              el mundo.
            </p>
            <a
              href="/register"
              className="bg-white text-blue-600 py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transitionn"
            >
              ¡Regístrate Gratis!
            </a>
          </div>
          <div className="md:w-1/2 mt-8 md:mt-0">
            <img
              src="https://placehold.co/600x400"
              alt="Fotografía profesional"
              className="rounded-lg shadow-lg mx-auto"
            />
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Características Destacadas
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="text-center">
              <div className="bg-blue-100 p-6 rounded-full inline-block mb-4">
                <i className="fas fa-user text-blue-600 text-3xl"></i>
              </div>
              <h4 className="text-2xl font-bold mb-2">
                Perfiles Personalizados
              </h4>
              <p className="text-gray-600">
                Crea un perfil único y profesional con tu biografía, foto y
                enlace exclusivo.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-6 rounded-full inline-block mb-4">
                <i className="fas fa-folder text-blue-600 text-3xl"></i>
              </div>
              <h4 className="text-2xl font-bold mb-2">Organización Avanzada</h4>
              <p className="text-gray-600">
                Organiza tus fotos en carpetas temáticas con descripciones y
                precios.
              </p>
            </div>
            <div className="text-center">
              <div className="bg-blue-100 p-6 rounded-full inline-block mb-4">
                <i className="fas fa-share-alt text-blue-600 text-3xl"></i>
              </div>
              <h4 className="text-2xl font-bold mb-2">Fácil Compartir</h4>
              <p className="text-gray-600">
                Comparte tus fotos con clientes mediante enlaces públicos.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      <section id="how-it-works" className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Cómo Funciona
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
            <div>
              <img
                src="https://placehold.co/600x400"
                alt="Cómo funciona"
                className="rounded-lg shadow-lg"
              />
            </div>
            <div>
              <ul className="list-disc list-inside text-lg text-gray-700 space-y-4">
                <li>Regístrate como fotógrafo o cliente.</li>
                <li>Crea un perfil profesional y organiza tus fotos.</li>
                <li>Comparte tu enlace único con clientes potenciales.</li>
                <li>
                  Explora y encuentra fotógrafos destacados en nuestra
                  plataforma.
                </li>
              </ul>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials Section */}
      <section id="testimonials" className="py-16 bg-gray-50">
        <div className="container mx-auto px-6 max-w-7xl">
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Testimonios
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "Gracias a Fotografía Pro, he conseguido más clientes y mi
                trabajo ahora luce más profesional. ¡Recomendado!"
              </p>
              <h4 className="font-bold text-gray-800">- María González</h4>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "Organizar mis fotos nunca fue tan fácil. Además, el soporte
                técnico es excelente."
              </p>
              <h4 className="font-bold text-gray-800">- Juan Pérez</h4>
            </div>
            <div className="p-6 bg-white rounded-lg shadow-md">
              <p className="text-gray-700 italic mb-4">
                "Organizar mis fotos nunca fue tan fácil. Además, el soporte
                técnico es excelente."
              </p>
              <h4 className="font-bold text-gray-800">- Juan Pérez</h4>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery Section */}
      <section id="gallery" className="py-16">
        <div className="container mx-auto px-6 max-w-7xl">
          <h3 className="text-4xl font-bold text-center text-gray-800 mb-12">
            Explora Nuestra Galería
          </h3>
          <div
            id="lightgallery"
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8"
          >
            {Array.from({ length: 6 }).map((_, index) => (
              <a
                key={index}
                href={`https://placehold.co/800x600?text=Foto+${index + 1}`}
                className="block"
              >
                <img
                  src={`https://placehold.co/400x300?text=Foto+${index + 1}`}
                  alt={`Galería ${index + 1}`}
                  className="rounded-lg shadow-md"
                />
              </a>
            ))}
          </div>
        </div>
      </section>

      {/* Call to Action Section */}
      <section id="register" className="bg-blue-600 text-white py-16">
        <div className="container mx-auto text-center px-6 max-w-7xl">
          <h3 className="text-4xl font-bold mb-4">Regístrate y Empieza Hoy</h3>
          <p className="text-lg mb-8">
            Forma parte de una comunidad profesional de fotógrafos y clientes.
          </p>
          <a
            href="/register"
            className="bg-white text-blue-600 py-3 px-6 rounded-full font-semibold hover:bg-gray-200 transitionn"
          >
            ¡Únete Ahora!
          </a>
        </div>
      </section>

      {/* Footer */}
      <Footer />
    </div>
  );
};

export default Home;
