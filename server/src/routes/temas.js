import express from "express";
import { db } from "../config/database.js";

const router = express.Router();

// API para obtener la lista de temas
router.get("/", (req, res) => {
  const query = "SELECT id, nombre FROM temas_albumes";

  db.query(query, (err, rows) => {
    if (err) {
      console.error("Error al obtener los temas:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los temas.",
      });
    }
    res.json({ success: true, temas: rows });
  });
});

export default router;
