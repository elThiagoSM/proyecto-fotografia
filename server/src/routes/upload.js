import express from "express";
const router = express.Router();
import { db } from "../config/database.js";

// API para subir una imagen a ImgBB y obtener la URL
router.post("/image", async (req, res) => {
  const { image } = req.body;

  try {
    if (!image) {
      return res
        .status(400)
        .json({ success: false, message: "La imagen es requerida." });
    }

    const formData = new URLSearchParams();
    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", image);

    const response = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const data = await response.json();

    if (data.success) {
      return res.json({ success: true, url: data.data.url });
    } else {
      console.error("ImgBB Error:", data.error);
      return res.status(400).json({
        success: false,
        message: data.error?.message || "Error al subir la imagen a ImgBB.",
      });
    }
  } catch (error) {
    console.error("Error en la subida de imagen:", error.message || error);
    return res
      .status(500)
      .json({ success: false, message: "Error interno del servidor." });
  }
});

export default router;
