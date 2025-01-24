import React, { useState } from "react";

const ImageUpload = () => {
  const [image, setImage] = useState(null);
  const [loading, setLoading] = useState(false);
  const [imageUrl, setImageUrl] = useState(null);
  const [error, setError] = useState(null);

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
    }
  };

  const handleImageUpload = async () => {
    if (!image) return;

    const formData = new FormData();
    formData.append("image", image);

    setLoading(true);
    setError(null);

    try {
      const response = await fetch(
        "https://api.imgbb.com/1/upload?key=4ea3fa67ab9903dcaabda33b923ace86", // Sustituye con tu API Key de imgBB
        {
          method: "POST",
          body: formData,
        }
      );

      const data = await response.json();

      if (data.success) {
        setImageUrl(data.data.url); // URL de la imagen subida
      } else {
        setError("Error al subir la imagen");
      }
    } catch (error) {
      setError("Error al conectar con el servidor");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-sm mx-auto p-4 border rounded-lg shadow-lg">
      <h2 className="text-xl font-bold mb-4 text-center">Subir Imagen</h2>
      <input
        type="file"
        onChange={handleImageChange}
        className="mb-4 w-full p-2 border border-gray-300 rounded-md"
      />
      <div className="flex justify-center items-center">
        <button
          onClick={handleImageUpload}
          className="px-4 py-2 bg-blue-500 text-white rounded-md disabled:bg-gray-400"
          disabled={loading}
        >
          {loading ? "Subiendo..." : "Subir Imagen"}
        </button>
      </div>

      {error && <p className="text-red-500 mt-2 text-center">{error}</p>}

      {imageUrl && (
        <div className="mt-4 text-center">
          <p>Imagen subida con éxito:</p>
          <img
            src={imageUrl}
            alt="Imagen subida"
            className="mt-2 max-w-full max-h-64 object-contain"
          />
        </div>
      )}
    </div>
  );
};

export default ImageUpload;
