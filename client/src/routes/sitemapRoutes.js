// sitemapRoutes.js
import Home from "../pages/Home";
import Register from "../pages/Register";
import Login from "../pages/Login";
import Albums from "../pages/Albums";
import PhotographerProfile from "../pages/PhotographerProfile";
import VerifyEmail from "../pages/VerifyEmail";
import AlbumDetails from "../pages/AlbumDetails";
import ViewAlbum from "../pages/ViewAlbum";

const routes = [
  { path: "/", component: Home },
  { path: "/register", component: Register },
  { path: "/login", component: Login },
  { path: "/:usuario", component: PhotographerProfile },
  { path: "/:usuario/albums", component: Albums },
  { path: "/:usuario/albums/:id_album/:titulo_album", component: AlbumDetails },
  {
    path: "/:usuario/view-album/:id_album/:titulo_album",
    component: ViewAlbum,
  },
  { path: "/verify-email", component: VerifyEmail },
];

export default routes;
