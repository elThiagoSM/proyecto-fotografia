import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { useDropzone } from "react-dropzone";
import { Helmet } from "react-helmet";
import ImageCard from "../components/cards/ImageCard";
import Header from "../components/Header";
import UploadProgressModal from "../components/modals/UploadProgressModal";

const AlbumDetails = () => {
  const { id_album, titulo_album } = useParams();
  const [photos, setPhotos] = useState([]);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState([]);
  const [files, setFiles] = useState([]);
  const [showModal, setShowModal] = useState(false);

  const fetchPhotos = async () => {
    try {
      const response = await fetch(`http://localhost:5000/photos/${id_album}`);
      const data = await response.json();

      if (data.success) {
        setPhotos(data.photos);
      } else {
        console.error(data.message);
      }
    } catch (error) {
      console.error("Error al obtener las fotos:", error);
    }
  };

  useEffect(() => {
    fetchPhotos();
  }, [id_album]);

  const handleDeletePhoto = (photoId) => {
    setPhotos((prevPhotos) =>
      prevPhotos.filter((photo) => photo.id !== photoId)
    );
  };

  const onDrop = useCallback(
    async (acceptedFiles) => {
      setFiles(acceptedFiles);
      setProgress(new Array(acceptedFiles.length).fill(0));
      setShowModal(true);
      setUploading(true);

      for (let i = 0; i < acceptedFiles.length; i++) {
        const file = acceptedFiles[i];
        try {
          const reader = new FileReader();

          reader.readAsDataURL(file);
          reader.onload = async () => {
            const base64Image = reader.result.split(",")[1];

            const uploadResponse = await fetch(
              "http://localhost:5000/upload/image",
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ image: base64Image }),
              }
            );
            const uploadData = await uploadResponse.json();

            if (uploadData.success) {
              const photoResponse = await fetch(
                "http://localhost:5000/photos",
                {
                  method: "POST",
                  headers: { "Content-Type": "application/json" },
                  body: JSON.stringify({
                    album_id: id_album,
                    nombre: file.name,
                    precio: 0.0,
                    url: uploadData.url,
                  }),
                }
              );

              const photoData = await photoResponse.json();

              if (photoData.success) {
                setPhotos((prev) => [
                  ...prev,
                  {
                    id: photoData.photoId,
                    url: uploadData.url,
                    titulo: file.name,
                    precio: 0,
                  },
                ]);
              } else {
                console.error(photoData.message);
              }
            } else {
              console.error("Error al subir la imagen:", uploadData.message);
            }
          };

          // Simular progreso
          for (let progressValue = 0; progressValue <= 100; progressValue++) {
            await new Promise((resolve) => setTimeout(resolve, 20));
            setProgress((prev) => {
              const newProgress = [...prev];
              newProgress[i] = progressValue;
              return newProgress;
            });
          }
        } catch (error) {
          console.error("Error en el proceso de subida:", error);
        }
      }

      setUploading(false);
      setShowModal(false);
    },
    [id_album]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  return (
    <div className="min-h-screen bg-gray-100">
      <Helmet>
        <title>{`Álbum: ${titulo_album} | FlashCaptu`}</title>
        <meta
          name="description"
          content={`Explora las imágenes del álbum "${titulo_album}" y descubre fotos únicas disponibles para compra o descarga.`}
        />
        <meta
          name="keywords"
          content="álbum, fotos, venta de fotos, fotografía profesional, FlashCaptu"
        />
        <meta name="author" content="FlashCaptu Team" />
        <meta property="og:title" content={`Álbum: ${titulo_album}`} />
        <meta
          property="og:description"
          content={`Descubre las imágenes del álbum "${titulo_album}" en FlashCaptu.`}
        />
        <meta property="og:image" content="/path/to/default-image.jpg" />
        <meta property="og:type" content="website" />
      </Helmet>
      <Header />
      <div className="container mx-auto max-w-7xl">
        <div className="container mx-auto p-6">
          <h1 className="text-2xl font-bold mb-4">{`Álbum: ${titulo_album}`}</h1>
          <div
            {...getRootProps()}
            className={`border-dashed border-2 p-6 rounded mb-6 ${
              isDragActive ? "border-blue-400" : "border-gray-400"
            }`}
          >
            <input {...getInputProps()} />
            {isDragActive ? (
              <p className="text-center text-blue-500">
                Suelta los archivos aquí...
              </p>
            ) : (
              <p className="text-center text-gray-500">
                Arrastra y suelta las imágenes aquí, o haz clic para seleccionar
                archivos.
              </p>
            )}
          </div>
          {uploading && (
            <p className="text-center text-blue-500 mb-4">
              Subiendo imágenes...
            </p>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
            {photos.map((photo) => (
              <ImageCard
                key={photo.id}
                photo={photo}
                onDelete={handleDeletePhoto}
              />
            ))}
          </div>
        </div>
      </div>

      {/* Modal para mostrar el progreso */}
      <UploadProgressModal
        isOpen={showModal}
        files={files}
        progress={progress}
        onClose={() => setShowModal(false)}
      />
    </div>
  );
};

export default AlbumDetails;
