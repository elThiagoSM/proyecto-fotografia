import express from "express";
const router = express.Router();
import { db } from "../config/database.js";

// API para crear un nuevo contacto
router.post("/", (req, res) => {
  const { usuario_id, tipo, detalle } = req.body;

  if (!usuario_id || !tipo || !detalle) {
    return res.status(400).json({
      success: false,
      message: "Todos los campos son obligatorios: usuario_id, tipo, detalle.",
    });
  }

  const sql = `INSERT INTO contactos (usuario_id, tipo, detalle) VALUES (?, ?, ?)`;

  db.query(sql, [usuario_id, tipo, detalle], (err, result) => {
    if (err) {
      console.error("Error al crear el contacto:", err);
      return res.status(500).json({
        success: false,
        message: "Error al crear el contacto.",
      });
    }

    res.json({
      success: true,
      message: "Contacto creado exitosamente.",
      contacto: {
        id: result.insertId,
        usuario_id,
        tipo,
        detalle,
      },
    });
  });
});

// API para actualizar un contacto existente
router.put("/:usuario_id/:tipo", (req, res) => {
  const { usuario_id, tipo } = req.params;
  const { detalle } = req.body;

  if (!detalle) {
    return res.status(400).json({
      success: false,
      message: "El campo detalle es obligatorio.",
    });
  }

  const sql = `UPDATE contactos SET detalle = ? WHERE usuario_id = ? AND tipo = ?`;

  db.query(sql, [detalle, usuario_id, tipo], (err, result) => {
    if (err) {
      console.error("Error al actualizar el contacto:", err);
      return res.status(500).json({
        success: false,
        message: "Error al actualizar el contacto.",
      });
    }

    if (result.affectedRows === 0) {
      return res.status(404).json({
        success: false,
        message: "Contacto no encontrado.",
      });
    }

    res.json({
      success: true,
      message: "Contacto actualizado exitosamente.",
    });
  });
});

// API para obtener todos los contactos de un usuario
router.get("/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  const sql = `SELECT id, tipo, detalle FROM contactos WHERE usuario_id = ?`;

  db.query(sql, [usuario_id], (err, results) => {
    if (err) {
      console.error("Error al obtener los contactos:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los contactos.",
      });
    }

    res.json({
      success: true,
      contactos: results,
    });
  });
});

export default router;
