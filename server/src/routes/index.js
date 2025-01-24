import express from "express";
import authRoutes from "./auth.js";
import albumRoutes from "./albums.js";
import photoRoutes from "./photos.js";
import usuarioRoutes from "./usuario.js";
import uploadRoutes from "./upload.js";
import contactosRoutes from "./contactos.js";
import temasRoutes from "./temas.js";

const router = express.Router();

router.use("/auth", authRoutes);
router.use("/albums", albumRoutes);
router.use("/photos", photoRoutes);
router.use("/usuario", usuarioRoutes);
router.use("/upload", uploadRoutes);
router.use("/contactos", contactosRoutes);
router.use("/temas", temasRoutes);

export default router;
