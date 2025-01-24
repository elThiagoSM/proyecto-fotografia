import React from "react";

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white py-10">
      <div className="container mx-auto px-6 text-center max-w-7xl">
        <div className="flex justify-center space-x-6 mb-6">
          <a href="#" className="text-blue-400 hover:text-blue-500">
            <i className="fab fa-facebook-f"></i>
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-500">
            <i className="fab fa-twitter"></i>
          </a>
          <a href="#" className="text-blue-400 hover:text-blue-500">
            <i className="fab fa-instagram"></i>
          </a>
        </div>
        <p>&copy; 2025 Fotografía Pro. Todos los derechos reservados.</p>
      </div>
    </footer>
  );
};

export default Footer;
