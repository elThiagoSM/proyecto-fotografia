import React, { useState, useEffect } from "react";

const toBase64 = (file) =>
  new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result.split(",")[1]); // Extraer Base64 sin el prefijo
    reader.onerror = (error) => reject(error);
  });

const EditAlbumModal = ({ album, onClose }) => {
  const [titulo, setTitulo] = useState(album.titulo);
  const [temaId, setTemaId] = useState(album.tema_id || "");
  const [tema, setTema] = useState(album.tema || "");
  const [publico, setPublico] = useState(album.publico);
  const [temas, setTemas] = useState([]);
  const [portada, setPortada] = useState(null); // Nueva portada seleccionada
  const [previewPortada, setPreviewPortada] = useState(album.url_portada); // Vista previa de la portada actual
  const [subiendo, setSubiendo] = useState(false);

  const fetchTemas = async () => {
    try {
      const response = await fetch("http://localhost:5000/temas");
      const data = await response.json();
      if (data.success) {
        setTemas(data.temas);
      }
    } catch (error) {
      console.error("Error al obtener temas:", error);
    }
  };

  const handlePortadaChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setPortada(file);
      const reader = new FileReader();
      reader.onload = () => setPreviewPortada(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSave = async () => {
    setSubiendo(true);
    let imageBase64 = null;

    if (portada) {
      try {
        imageBase64 = await toBase64(portada);
      } catch (error) {
        console.error("Error al convertir la imagen a Base64:", error);
        alert("Error al procesar la imagen.");
        setSubiendo(false);
        return;
      }
    }

    let imageUrl = album.url_portada;
    if (imageBase64) {
      try {
        const response = await fetch(
          `http://localhost:5000/albums/${album.id}/portada`,
          {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ image: imageBase64 }),
          }
        );
        const data = await response.json();

        if (data.success) {
          imageUrl = data.url;
        } else {
          alert("Error al subir la portada.");
          setSubiendo(false);
          return;
        }
      } catch (error) {
        console.error("Error al subir la portada:", error);
        alert("Error al subir la portada.");
        setSubiendo(false);
        return;
      }
    }

    try {
      const response = await fetch(`http://localhost:5000/albums/${album.id}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          titulo,
          tema,
          tema_id: temaId,
          publico,
          url_portada: imageUrl,
        }),
      });
      const data = await response.json();

      if (data.success) {
        alert("Álbum actualizado correctamente.");
        onClose();
      } else {
        alert("Error al actualizar el álbum.");
      }
    } catch (error) {
      console.error("Error al actualizar el álbum:", error);
      alert("Error al actualizar el álbum.");
    } finally {
      setSubiendo(false);
    }
  };

  useEffect(() => {
    fetchTemas();
  }, []);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-60 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl w-full max-w-lg p-8 relative">
        <h2 className="text-2xl font-semibold text-gray-800 mb-6">
          Editar Álbum
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Título
            </label>
            <input
              type="text"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={titulo}
              onChange={(e) => setTitulo(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Tema
            </label>
            <select
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-blue-500 focus:border-blue-500"
              value={temaId}
              onChange={(e) => setTemaId(e.target.value)}
            >
              <option value="">{album.tema}</option>
              {temas.map((tema) => (
                <option key={tema.id} value={tema.id}>
                  {tema.nombre}
                </option>
              ))}
            </select>
          </div>

          <div className="flex items-center">
            <input
              type="checkbox"
              id="publico"
              className="mr-2 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              checked={publico}
              onChange={(e) => setPublico(e.target.checked)}
            />
            <label
              htmlFor="publico"
              className="text-sm font-medium text-gray-700"
            >
              ¿Público?
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Portada
            </label>
            <div className="mb-4">
              <img
                src={previewPortada}
                alt="Portada actual"
                className="w-full h-48 object-cover rounded-lg border"
              />
            </div>
            <input
              type="file"
              accept="image/*"
              onChange={handlePortadaChange}
              className="block w-full text-sm text-gray-600 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-semibold file:bg-blue-50 file:text-blue-700 hover:file:bg-blue-100"
            />
          </div>
        </div>

        <div className="mt-6 flex justify-end gap-4">
          <button
            className="px-4 py-2 bg-gray-500 text-white rounded-lg hover:bg-gray-600 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
            onClick={onClose}
            disabled={subiendo}
          >
            Cancelar
          </button>
          <button
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
            onClick={handleSave}
            disabled={subiendo}
          >
            {subiendo ? "Guardando..." : "Guardar"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditAlbumModal;
