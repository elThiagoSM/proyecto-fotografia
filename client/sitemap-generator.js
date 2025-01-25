// sitemap-generator.js
import Sitemap from "react-router-sitemap";
import routes from "./src/routes/sitemapRoutes.js";

const generateSitemap = () => {
  const sitemap = new Sitemap(routes)
    .build("https://proyecto-fotografia-iota.vercel.app/") // Cambia esto por el dominio de tu sitio
    .save("./public/sitemap.xml"); // Guarda el archivo en la carpeta `public`
};

generateSitemap();
