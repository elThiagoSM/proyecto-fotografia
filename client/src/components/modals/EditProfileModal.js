import React, { useState } from "react";
import { FaTimes, FaCheck, FaEdit } from "react-icons/fa";

const EditProfile = ({ onClose, photographer }) => {
  const [photographerInfo, setPhotographerInfo] = useState({
    nombre_completo: photographer.nombre_completo || "",
    nombre_usuario: photographer.nombre_usuario || "",
    email: photographer.email || "",
    biografia: photographer.biografia || "",
    profileImage: photographer.foto_perfil || "",
  });
  const [editingField, setEditingField] = useState(null);
  const [tempValue, setTempValue] = useState({});
  const [profileImage, setProfileImage] = useState(photographer.foto_perfil);
  const [newProfileImage, setNewProfileImage] = useState(null); // Nueva imagen
  const [errorMessage, setErrorMessage] = useState("");

  // Convertir imagen a Base64
  const toBase64 = (file) =>
    new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result.split(",")[1]); // Extraer Base64 sin el prefijo
      reader.onerror = (error) => reject(error);
    });

  // Cambiar la imagen de perfil
  const handleProfileImageChange = async (event) => {
    const file = event.target.files[0];
    if (file) {
      setProfileImage(URL.createObjectURL(file)); // Vista previa
      setNewProfileImage(await toBase64(file)); // Convertir a Base64
    }
  };

  // Manejar edición de un campo
  const handleEditField = (field) => {
    setEditingField(field);
    setTempValue({ ...tempValue, [field]: photographerInfo[field] });
  };

  // Guardar cambios en el estado interno
  const handleConfirmField = (field) => {
    setPhotographerInfo({
      ...photographerInfo,
      [field]: tempValue[field],
    });
    setEditingField(null);
  };

  // Cancelar cambios
  const handleCancelEdit = (field) => {
    setTempValue((prev) => ({ ...prev, [field]: photographerInfo[field] }));
    setEditingField(null);
  };

  // Guardar cambios en el backend
  const handleSaveChanges = async () => {
    try {
      const response = await fetch(
        `http://localhost:5000/usuario/${photographer.nombre_usuario}`,
        {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            nombre_completo: photographerInfo.nombre_completo,
            nuevo_nombre_usuario: photographerInfo.nombre_usuario,
            biografia: photographerInfo.biografia,
            foto_perfil: newProfileImage, // Enviar nueva imagen (Base64)
          }),
        }
      );

      const data = await response.json();

      if (response.ok && data.success) {
        console.log("Perfil actualizado correctamente:", data.message);
        onClose(); // Cierra el modal después de guardar
      } else {
        setErrorMessage(
          data.message || "No se pudo actualizar el perfil. Intenta nuevamente."
        );
      }
    } catch (error) {
      console.error("Error al actualizar el perfil:", error);
      setErrorMessage("Hubo un problema con la solicitud. Intenta más tarde.");
    }
  };

  return (
    <div className="flex justify-center items-center">
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-6xl p-10">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        <div className="flex items-start">
          {/* Imagen de perfil */}
          <div className="flex flex-col items-center mr-10">
            <img
              src={
                profileImage ||
                photographerInfo.profileImage ||
                "/default-profile.png"
              }
              alt="Imagen de perfil"
              className="w-56 h-56 rounded-full object-cover mb-4"
            />
            <label className="bg-blue-500 text-white px-4 py-2 rounded cursor-pointer hover:bg-indigo-600 transition">
              Cambiar Imagen
              <input
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleProfileImageChange}
              />
            </label>
          </div>

          {/* Información del perfil */}
          <div className="flex-grow">
            <h2 className="text-3xl font-bold text-gray-800 mb-6">
              Información del Fotógrafo
            </h2>
            {errorMessage && (
              <div className="text-red-500 text-sm mb-4">{errorMessage}</div>
            )}
            <div className="space-y-6">
              {[
                { label: "Nombre Completo", field: "nombre_completo" },
                { label: "Usuario", field: "nombre_usuario" },
                {
                  label: "Email",
                  field: "email",
                  readOnly: true,
                  grayEdit: true,
                },
                { label: "Biografía", field: "biografia", isTextarea: true },
              ].map(({ label, field, readOnly, isTextarea, grayEdit }) => (
                <div key={field} className="relative flex items-center">
                  <label className="block text-sm font-medium text-gray-600 w-48">
                    {label}:
                  </label>
                  {isTextarea ? (
                    <textarea
                      value={
                        editingField === field
                          ? tempValue[field]
                          : photographerInfo[field]
                      }
                      onChange={(e) =>
                        setTempValue({ ...tempValue, [field]: e.target.value })
                      }
                      disabled={editingField !== field}
                      className={`border border-gray-300 rounded px-4 py-2 w-full pr-10 ${
                        editingField !== field ? "bg-gray-100" : ""
                      }`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={
                        editingField === field
                          ? tempValue[field]
                          : photographerInfo[field]
                      }
                      onChange={(e) =>
                        setTempValue({ ...tempValue, [field]: e.target.value })
                      }
                      disabled={editingField !== field || readOnly}
                      className={`border border-gray-300 rounded px-4 py-2 w-full pr-10 ${
                        editingField !== field ? "bg-gray-100" : ""
                      }`}
                    />
                  )}
                  <div className="absolute right-4 flex items-center space-x-2">
                    {editingField === field ? (
                      <>
                        <button
                          onClick={() => handleConfirmField(field)}
                          className="text-green-500 hover:text-green-700"
                        >
                          <FaCheck size={18} />
                        </button>
                        <button
                          onClick={() => handleCancelEdit(field)}
                          className="text-red-500 hover:text-red-700"
                        >
                          <FaTimes size={18} />
                        </button>
                      </>
                    ) : (
                      <button
                        onClick={() => handleEditField(field)}
                        className={`${
                          grayEdit
                            ? "text-gray-400 hover:text-gray-500"
                            : "text-blue-500 hover:text-blue-700"
                        }`}
                        disabled={grayEdit}
                      >
                        <FaEdit size={18} />
                      </button>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Botones para guardar/cancelar */}
        <div className="mt-8 flex justify-end space-x-4">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
          >
            Cancelar
          </button>
          <button
            onClick={handleSaveChanges}
            className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-indigo-600 transition"
          >
            Guardar
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;
