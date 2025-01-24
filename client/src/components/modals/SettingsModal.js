import React, { useState, useEffect } from "react";
import PhoneInput from "react-phone-number-input";
import "react-phone-number-input/style.css";
import {
  FaTimes,
  FaPhone,
  FaInstagram,
  FaTwitter,
  FaYoutube,
  FaTiktok,
  FaGlobe,
  FaCheck,
  FaEdit,
  FaSignOutAlt,
  FaBug,
  FaPalette,
} from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import ConfirmationModal from "./ConfirmationModal";

const SettingsModal = ({ onClose, usuarioId }) => {
  const [activeOption, setActiveOption] = useState("contact");
  const [contactInfo, setContactInfo] = useState({
    telefono: "",
    instagram: "",
    twitter: "",
    youtube: "",
    tiktok: "",
    sitio_web: "",
  });
  const [editingField, setEditingField] = useState(null);
  const [showConfirmationModal, setShowConfirmationModal] = useState(false);
  const [tempValue, setTempValue] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    // Obtener los contactos del usuario al cargar el componente
    fetch(`http://localhost:5000/contactos/${usuarioId}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.success) {
          const contactos = data.contactos.reduce((acc, contacto) => {
            acc[contacto.tipo] = contacto.detalle;
            return acc;
          }, {});
          setContactInfo(contactos);
        }
      })
      .catch((err) => console.error("Error al obtener contactos:", err));
  }, [usuarioId]);

  const handleEditField = (field) => {
    setEditingField(field);
    setTempValue(contactInfo[field]);
  };

  const handleSaveContact = () => {
    const promises = Object.keys(contactInfo).map((tipo) => {
      const detalle = contactInfo[tipo];
      if (!detalle) return null; // Si no hay detalle, no hacemos nada

      return fetch(`http://localhost:5000/contactos/${usuarioId}/${tipo}`, {
        method: "PUT", // Intentamos actualizar primero
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ detalle }),
      })
        .then((res) => res.json())
        .then((data) => {
          if (!data.success && data.message === "Contacto no encontrado.") {
            // Si no existe, lo creamos con POST
            return fetch(`http://localhost:5000/contactos`, {
              method: "POST",
              headers: {
                "Content-Type": "application/json",
              },
              body: JSON.stringify({
                usuario_id: usuarioId,
                tipo,
                detalle,
              }),
            });
          }
          if (!data.success) {
            console.error(
              `Error al guardar el contacto ${tipo}:`,
              data.message
            );
          }
        })
        .catch((err) =>
          console.error(`Error al procesar el contacto ${tipo}:`, err)
        );
    });

    Promise.all(promises)
      .then(() => alert("Datos de contacto guardados exitosamente"))
      .catch(() => alert("Hubo un error al guardar los datos de contacto."));
  };

  const handleConfirmField = (field) => {
    setContactInfo({ ...contactInfo, [field]: tempValue });
    setEditingField(null);
  };

  const handleCancelEdit = () => {
    setEditingField(null);
    setTempValue("");
  };

  const handleLogout = () => {
    setShowConfirmationModal(true);
  };

  const confirmLogout = () => {
    setShowConfirmationModal(false);
    sessionStorage.removeItem("user");
    navigate("/");
  };

  const cancelLogout = () => {
    setShowConfirmationModal(false);
  };

  const renderContactInfo = () => (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Datos de contacto
      </h2>
      <div className="space-y-4 flex-grow overflow-y-auto">
        {[
          { field: "telefono", icon: <FaPhone /> },
          { field: "instagram", icon: <FaInstagram /> },
          { field: "twitter", icon: <FaTwitter /> },
          { field: "youtube", icon: <FaYoutube /> },
          { field: "tiktok", icon: <FaTiktok /> },
          { field: "sitio_web", icon: <FaGlobe /> },
        ].map(({ field, icon }) => (
          <div key={field} className="relative flex items-center">
            <div className="w-10 text-lg text-center text-gray-600">{icon}</div>

            {field === "telefono" ? (
              <PhoneInput
                placeholder="Ingresa tu teléfono"
                value={
                  editingField === "telefono" ? tempValue : contactInfo.telefono
                } // Usa tempValue solo al editar
                onChange={(phone) => setTempValue(phone)} // Actualiza tempValue
                disabled={editingField !== "telefono"}
                defaultCountry="UY"
                international={true}
                addInternationalOption={false}
                className={`border border-gray-300 rounded px-4 py-2 w-full ${
                  editingField !== "telefono" ? "bg-gray-100" : ""
                }`}
              />
            ) : (
              <input
                type="text"
                value={
                  editingField === field
                    ? tempValue
                    : field === "instagram" ||
                        field === "twitter" ||
                        field === "tiktok"
                      ? `@${contactInfo[field] || ""}`
                      : field === "youtube"
                        ? `youtube.com/${contactInfo[field] || ""}`
                        : contactInfo[field]
                }
                onChange={(e) =>
                  setTempValue(
                    e.target.value.replace(/^[@]|youtube\.com\//, "")
                  )
                }
                disabled={editingField !== field}
                placeholder={`Añade tu ${field}`}
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
                    onClick={handleCancelEdit}
                    className="text-red-500 hover:text-red-700"
                  >
                    <FaTimes size={18} />
                  </button>
                </>
              ) : (
                <button
                  onClick={() => handleEditField(field)}
                  className="text-blue-500 hover:text-blue-700"
                >
                  <FaEdit size={18} />
                </button>
              )}
            </div>
          </div>
        ))}
      </div>
      <div className="mt-4 flex justify-end space-x-4">
        <button
          onClick={handleCancelEdit}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleSaveContact}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Guardar
        </button>
      </div>
    </div>
  );

  const renderReportProblem = () => (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">
        Informar un problema
      </h2>
      <textarea
        placeholder="Describe el problema que estás experimentando..."
        className="border border-gray-300 rounded w-full p-4 flex-grow resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
      ></textarea>
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => console.log("Problema informado")}
          className="bg-blue-500 text-white px-6 py-2 rounded hover:bg-blue-700 transition"
        >
          Enviar
        </button>
      </div>
    </div>
  );

  const renderChangeTopic = () => (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">Cambiar de tema</h2>
      <p className="text-gray-600">Selecciona un tema nuevo para explorar:</p>
      <ul className="mt-4 space-y-2 flex-grow">
        <li className="cursor-pointer text-blue-500 hover:underline">Tema 1</li>
        <li className="cursor-pointer text-blue-500 hover:underline">Tema 2</li>
        <li className="cursor-pointer text-blue-500 hover:underline">Tema 3</li>
      </ul>
    </div>
  );

  const renderLogout = () => (
    <div className="flex flex-col h-full">
      <h2 className="text-2xl font-bold text-gray-800 mb-4">¿Cerrar sesión?</h2>
      <p className="text-gray-600 flex-grow">
        Estás a punto de cerrar sesión. ¿Estás seguro?
      </p>
      <div className="mt-6 flex justify-end space-x-4">
        <button
          onClick={onClose}
          className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
        >
          Cancelar
        </button>
        <button
          onClick={handleLogout}
          className="bg-red-500 text-white px-6 py-2 rounded hover:bg-red-700 transition"
        >
          Cerrar sesión
        </button>
      </div>
    </div>
  );

  const renderContent = () => {
    switch (activeOption) {
      case "contact":
        return renderContactInfo();
      case "report":
        return renderReportProblem();
      case "change_topic":
        return renderChangeTopic();
      case "logout":
        return renderLogout();
      default:
        return null;
    }
  };

  return (
    <div className="flex justify-center items-center w-full h-screen">
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl p-6 flex items-stretch">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        <div className="w-1/3 border-r border-gray-300 pr-4">
          <ul className="space-y-4">
            <li
              className={`flex items-center cursor-pointer p-3 rounded ${
                activeOption === "contact"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveOption("contact")}
            >
              <FaPhone className="mr-2" />
              Datos de contacto
            </li>
            <li
              className={`flex items-center cursor-pointer p-3 rounded ${
                activeOption === "report"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveOption("report")}
            >
              <FaBug className="mr-2" />
              Informar problema
            </li>
            <li
              className={`flex items-center cursor-pointer p-3 rounded ${
                activeOption === "change_topic"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveOption("change_topic")}
            >
              <FaPalette className="mr-2" />
              Cambiar de tema
            </li>
            <li
              className={`flex items-center cursor-pointer p-3 rounded ${
                activeOption === "logout"
                  ? "bg-blue-500 text-white"
                  : "text-gray-700 hover:bg-gray-100"
              }`}
              onClick={() => setActiveOption("logout")}
            >
              <FaSignOutAlt className="mr-2" />
              Cerrar sesión
            </li>
          </ul>
        </div>

        <div className="w-2/3 pl-6">{renderContent()}</div>
      </div>

      {showConfirmationModal && (
        <ConfirmationModal
          title="Confirmar Cierre de Sesión"
          message="¿Estás seguro de que deseas cerrar sesión?"
          onConfirm={confirmLogout}
          onCancel={cancelLogout}
        />
      )}
    </div>
  );
};

export default SettingsModal;
