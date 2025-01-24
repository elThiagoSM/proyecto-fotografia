import express from "express";
import { db } from "../config/database.js";

const router = express.Router();

// API para obtener todas las fotos de un álbum
router.get("/:albumId", (req, res) => {
  const { albumId } = req.params;

  const query = `
    SELECT id, nombre AS titulo, precio, url, fecha_subida
    FROM fotos
    WHERE album_id = ?
    ORDER BY fecha_subida DESC;
  `;

  db.query(query, [albumId], (err, results) => {
    if (err) {
      console.error("Error al obtener fotos:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener las fotos del álbum.",
      });
    }

    res.status(200).json({
      success: true,
      photos: results,
    });
  });
});

// API para agregar una foto a un álbum
router.post("/", (req, res) => {
  const { album_id, nombre, precio, url } = req.body;

  console.log("Datos recibidos para insertar en fotos:", req.body); // Log detallado

  // Verificar campos requeridos
  if (!album_id || !nombre || !url) {
    return res.status(400).json({
      success: false,
      message: "Campos requeridos faltantes (album_id, nombre, url).",
    });
  }

  const query = `
    INSERT INTO fotos (album_id, nombre, precio, url) 
    VALUES (?, ?, ?, ?)
  `;

  db.query(query, [album_id, nombre, precio || 0.0, url], (err, result) => {
    if (err) {
      console.error("Error al insertar foto en la base de datos:", err);
      return res.status(500).json({
        success: false,
        message: "Error al insertar foto en la base de datos.",
      });
    }

    res.json({ success: true, photoId: result.insertId });
  });
});

// API para editar una foto
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { nombre, precio } = req.body;

  // Verificar que al menos un campo esté presente para actualizar
  if (!nombre && precio === undefined) {
    return res.status(400).json({
      success: false,
      message: "Debe proporcionar al menos un campo para actualizar.",
    });
  }

  const query = `
    UPDATE fotos 
    SET nombre = COALESCE(?, nombre), 
        precio = COALESCE(?, precio) 
    WHERE id = ?
  `;

  db.query(query, [nombre, precio, id], (err) => {
    if (err) {
      console.error("Error al editar la foto:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al editar la foto." });
    }

    res.json({ success: true });
  });
});

// API para eliminar una foto
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = `
    DELETE FROM fotos 
    WHERE id = ?
  `;

  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error al eliminar la foto:", err);
      return res
        .status(500)
        .json({ success: false, message: "Error al eliminar la foto." });
    }

    res.json({ success: true });
  });
});

export default router;
