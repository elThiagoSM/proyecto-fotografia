import React, { useState, useEffect } from "react";
import { FaTimes, FaCopy } from "react-icons/fa";

const ContactsModal = ({ onClose, usuarioId }) => {
  const [contacts, setContacts] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [copiedField, setCopiedField] = useState("");

  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL;

  // Fetch para obtener los contactos
  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const response = await fetch(`${API_BASE_URL}/contactos/${usuarioId}`);
        const data = await response.json();

        if (data.success) {
          const formattedContacts = {};
          data.contactos.forEach((contact) => {
            formattedContacts[contact.tipo] = contact.detalle;
          });
          setContacts(formattedContacts);
        } else {
          setError("No se pudieron cargar los contactos.");
        }
      } catch (err) {
        setError("Error al conectarse al servidor.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchContacts();
  }, [usuarioId]);

  // Manejar copia del contenido
  const handleCopy = (field) => {
    navigator.clipboard.writeText(contacts[field]);
    setCopiedField(field);
    setTimeout(() => setCopiedField(""), 2000); // Mensaje temporal de copiado
  };

  if (isLoading) {
    return <div className="flex justify-center items-center">Cargando...</div>;
  }

  if (error) {
    return (
      <div className="flex justify-center items-center">
        <div className="bg-red-100 text-red-700 p-4 rounded">{error}</div>
      </div>
    );
  }

  // Filtrar contactos disponibles
  const availableContacts = Object.entries(contacts).filter(
    ([_, value]) => value
  );

  return (
    <div className="flex justify-center items-center">
      {/* Modal */}
      <div className="relative bg-white rounded-lg shadow-lg w-full max-w-4xl p-8">
        {/* Botón de cierre */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-500 hover:text-gray-800"
        >
          <FaTimes size={20} />
        </button>

        <div>
          <h2 className="text-3xl font-bold text-gray-800 mb-6">
            Información de Contacto
          </h2>

          <div className="space-y-6">
            {availableContacts.map(([field, value]) => {
              const labelMap = {
                telefono: "Teléfono",
                instagram: "Instagram",
                twitter: "Twitter",
                youtube: "YouTube",
                tiktok: "TikTok",
                sitio_web: "Sitio Web",
              };

              return (
                <div key={field} className="relative flex items-center">
                  <label className="block text-sm font-medium text-gray-600 w-48">
                    {labelMap[field]}:
                  </label>
                  <input
                    type="text"
                    value={value}
                    readOnly
                    className="border border-gray-300 rounded px-4 py-2 w-full bg-gray-100 cursor-default"
                  />
                  <button
                    onClick={() => handleCopy(field)}
                    className="absolute right-4 text-blue-500 hover:text-blue-700"
                  >
                    <FaCopy size={18} />
                  </button>
                  {copiedField === field && (
                    <span className="absolute right-12 text-green-500 text-sm">
                      Copiado!
                    </span>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* Botón de cerrar */}
        <div className="mt-8 flex justify-end">
          <button
            onClick={onClose}
            className="bg-gray-500 text-white px-6 py-2 rounded hover:bg-gray-700 transition"
          >
            Cerrar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ContactsModal;
