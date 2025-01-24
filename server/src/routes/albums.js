import express from "express";
import { db } from "../config/database.js";

const router = express.Router();

// API para crear un nuevo álbum
router.post("/", (req, res) => {
  const { usuario_id, titulo, tema_id, publico } = req.body;

  if (!usuario_id || !titulo) {
    return res.status(400).json({
      success: false,
      message: "Campos obligatorios: usuario_id y titulo.",
    });
  }

  const query = `
    INSERT INTO albumes (usuario_id, titulo, tema_id, publico)
    VALUES (?, ?, ?, ?)
  `;

  db.query(
    query,
    [usuario_id, titulo, tema_id || null, publico || false],
    (err, result) => {
      if (err) {
        console.error("Error al crear álbum:", err);
        return res.status(500).json({
          success: false,
          message: "Error interno en la base de datos.",
        });
      }
      res.json({ success: true, albumId: result.insertId });
    }
  );
});

// API para obtener los álbumes de un usuario
router.get("/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  const query = `
    SELECT 
      a.id, 
      a.titulo, 
      a.fecha_creacion, 
      a.publico, 
      a.url_portada, 
      t.nombre AS tema
    FROM albumes a
    LEFT JOIN temas_albumes t ON a.tema_id = t.id
    WHERE a.usuario_id = ?
    ORDER BY a.fecha_creacion DESC
  `;

  db.query(query, [usuario_id], (err, rows) => {
    if (err) {
      console.error("Error al obtener álbumes:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los álbumes.",
      });
    }
    res.json({ success: true, albums: rows });
  });
});

// API para obtener álbumes públicos con al menos una foto asociada
router.get("/publicos/:usuario_id", (req, res) => {
  const { usuario_id } = req.params;

  const query = `
    SELECT 
      a.id, 
      a.titulo, 
      a.url_portada, 
      a.fecha_creacion, 
      t.nombre AS tema
    FROM albumes a
    JOIN fotos f ON a.id = f.album_id
    LEFT JOIN temas_albumes t ON a.tema_id = t.id
    WHERE a.usuario_id = ? AND a.publico = TRUE
    GROUP BY a.id
    HAVING COUNT(f.id) > 0
    ORDER BY a.fecha_creacion DESC
  `;

  db.query(query, [usuario_id], (err, result) => {
    if (err) {
      console.error("Error al obtener los álbumes públicos:", err);
      return res.status(500).json({
        success: false,
        message: "Hubo un error al obtener los álbumes públicos.",
      });
    }

    res.json({
      success: true,
      albums: result,
    });
  });
});

// API para actualizar un álbum
router.put("/:id", (req, res) => {
  const { id } = req.params;
  const { titulo, tema_id, publico } = req.body;

  if (!titulo) {
    return res.status(400).json({
      success: false,
      message: "El campo 'titulo' es obligatorio.",
    });
  }

  const query = `
    UPDATE albumes 
    SET titulo = ?, tema_id = ?, publico = ?
    WHERE id = ?
  `;

  db.query(
    query,
    [titulo, tema_id || null, publico || false, id],
    (err, result) => {
      if (err) {
        console.error("Error al actualizar el álbum:", err);
        return res.status(500).json({
          success: false,
          message: "Error interno en la base de datos.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Álbum no encontrado.",
        });
      }

      res.json({ success: true, message: "Álbum actualizado correctamente." });
    }
  );
});

// API para eliminar un álbum
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const query = "DELETE FROM albumes WHERE id = ?";

  db.query(query, [id], (err) => {
    if (err) {
      console.error("Error al eliminar el álbum:", err);
      return res.status(500).json({
        success: false,
        message: "Error al eliminar el álbum.",
      });
    }
    res.json({ success: true });
  });
});

// API para subir la portada de un álbum y actualizar la base de datos
router.post("/:id/portada", async (req, res) => {
  const { id } = req.params;
  const { image } = req.body;

  try {
    if (!image) {
      return res.status(400).json({
        success: false,
        message: "La imagen es requerida.",
      });
    }

    const formData = new URLSearchParams();
    formData.append("key", process.env.IMGBB_API_KEY);
    formData.append("image", image);

    const imgbbResponse = await fetch("https://api.imgbb.com/1/upload", {
      method: "POST",
      body: formData,
    });

    const imgbbData = await imgbbResponse.json();

    if (!imgbbData.success) {
      console.error("ImgBB Error:", imgbbData.error);
      return res.status(400).json({
        success: false,
        message:
          imgbbData.error?.message || "Error al subir la imagen a ImgBB.",
      });
    }

    const imageUrl = imgbbData.data.url;

    const query = `
      UPDATE albumes 
      SET url_portada = ? 
      WHERE id = ?
    `;

    db.query(query, [imageUrl, id], (err, result) => {
      if (err) {
        console.error("Error al actualizar la portada del álbum:", err);
        return res.status(500).json({
          success: false,
          message: "Error interno al actualizar la portada.",
        });
      }

      if (result.affectedRows === 0) {
        return res.status(404).json({
          success: false,
          message: "Álbum no encontrado.",
        });
      }

      res.json({
        success: true,
        message: "Portada actualizada correctamente.",
        url: imageUrl,
      });
    });
  } catch (error) {
    console.error("Error en la subida y actualización de portada:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
});

export default router;
