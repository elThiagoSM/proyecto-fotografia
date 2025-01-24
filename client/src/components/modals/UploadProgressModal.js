import React from "react";

const UploadProgressModal = ({ isOpen, files, progress, onClose }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center">
      <div className="bg-white rounded-lg shadow-lg p-6 w-full max-w-md">
        <h2 className="text-lg font-bold mb-4">Subiendo imágenes</h2>
        <ul className="space-y-4">
          {files.map((file, index) => (
            <li key={index} className="flex items-center space-x-4">
              <span className="truncate w-32">{file.name}</span>
              <div className="flex-1 bg-gray-200 h-2 rounded overflow-hidden">
                <div
                  className="bg-blue-500 h-full"
                  style={{ width: `${progress[index]}%` }}
                ></div>
              </div>
              <span className="text-sm">{progress[index]}%</span>
            </li>
          ))}
        </ul>
        <button
          className="mt-4 bg-red-500 text-white px-4 py-2 rounded"
          onClick={onClose}
        >
          Cerrar
        </button>
      </div>
    </div>
  );
};

export default UploadProgressModal;
