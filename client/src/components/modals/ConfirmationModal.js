import React from "react";

const ConfirmationModal = ({ title, message, onConfirm, onCancel }) => {
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
      <div className="bg-white p-6 rounded-lg shadow-lg w-96 text-center">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">{title}</h2>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-center gap-4">
          <button
            className="bg-red-600 text-white px-4 py-2 rounded hover:bg-red-700 transition"
            onClick={onConfirm}
          >
            Confirmar
          </button>
          <button
            className="bg-gray-600 text-white px-4 py-2 rounded hover:bg-gray-700 transition"
            onClick={onCancel}
          >
            Cancelar
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
