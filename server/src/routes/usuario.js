import express from "express";
const router = express.Router();
import { db } from "../config/database.js";

// API para obtener el perfil del usuario por su 'nombre_usuario'
router.get("/:nombre_usuario", (req, res) => {
  const { nombre_usuario } = req.params;

  // Primero, obtenemos los datos del usuario
  const sqlUsuario = `
    SELECT id, tipo, nombre_completo, nombre_usuario, email, biografia, foto_perfil, fecha_registro, verificado 
    FROM usuarios 
    WHERE nombre_usuario = ?`;

  db.query(sqlUsuario, [nombre_usuario], (err, userResults) => {
    if (err) {
      console.error("Error al obtener los datos del usuario:", err);
      return res.status(500).json({
        success: false,
        message: "Error al obtener los datos del usuario.",
      });
    }

    if (userResults.length === 0) {
      return res.status(404).json({
        success: false,
        message: "Usuario no encontrado.",
      });
    }

    const user = userResults[0];

    // Ahora obtenemos los contactos del usuario
    const sqlContactos = `
      SELECT tipo, detalle 
      FROM contactos 
      WHERE usuario_id = ?`;

    db.query(sqlContactos, [user.id], (err, contactResults) => {
      if (err) {
        console.error("Error al obtener los contactos:", err);
        return res.status(500).json({
          success: false,
          message: "Error al obtener los contactos.",
        });
      }

      // Ahora obtenemos los álbumes del usuario
      const sqlAlbumes = `
        SELECT a.id, a.titulo, a.url_portada, a.fecha_creacion, a.publico, t.nombre AS tema 
        FROM albumes a 
        LEFT JOIN temas_albumes t ON a.tema_id = t.id 
        WHERE a.usuario_id = ?`;

      db.query(sqlAlbumes, [user.id], (err, albumResults) => {
        if (err) {
          console.error("Error al obtener los álbumes:", err);
          return res.status(500).json({
            success: false,
            message: "Error al obtener los álbumes.",
          });
        }

        // Si todo va bien, enviamos los datos del usuario, sus contactos y álbumes
        res.json({
          success: true,
          user: {
            id: user.id,
            tipo: user.tipo,
            nombre_completo: user.nombre_completo,
            nombre_usuario: user.nombre_usuario,
            email: user.email,
            biografia: user.biografia,
            foto_perfil: user.foto_perfil,
            fecha_registro: user.fecha_registro,
            verificado: user.verificado,
          },
          contactos: contactResults, // Incluimos los contactos
          albumes: albumResults, // Incluimos los álbumes
        });
      });
    });
  });
});

router.put("/:nombre_usuario", async (req, res) => {
  const { nombre_usuario } = req.params;
  const { nombre_completo, nuevo_nombre_usuario, biografia, foto_perfil } =
    req.body;

  try {
    // Verifica si se proporciona una nueva foto de perfil
    let nuevaFotoPerfilUrl = null;
    if (foto_perfil) {
      const formData = new URLSearchParams();
      formData.append("key", process.env.IMGBB_API_KEY);
      formData.append("image", foto_perfil);

      const response = await fetch("https://api.imgbb.com/1/upload", {
        method: "POST",
        body: formData,
      });

      const data = await response.json();

      if (data.success) {
        nuevaFotoPerfilUrl = data.data.url;
      } else {
        return res.status(400).json({
          success: false,
          message: data.error?.message || "Error al subir la imagen a ImgBB.",
        });
      }
    }

    // Actualizamos los datos del usuario en la base de datos
    const sqlUpdate = `
          UPDATE usuarios
          SET 
              nombre_completo = ?, 
              nombre_usuario = ?, 
              biografia = ?,
              foto_perfil = COALESCE(?, foto_perfil)
          WHERE nombre_usuario = ?
      `;

    db.query(
      sqlUpdate,
      [
        nombre_completo,
        nuevo_nombre_usuario,
        biografia,
        nuevaFotoPerfilUrl,
        nombre_usuario,
      ],
      (err, result) => {
        if (err) {
          console.error("Error al actualizar el perfil:", err);
          return res.status(500).json({
            success: false,
            message: "Error al actualizar el perfil.",
          });
        }

        if (result.affectedRows === 0) {
          return res.status(404).json({
            success: false,
            message: "Usuario no encontrado.",
          });
        }

        res.json({
          success: true,
          message: "Perfil actualizado correctamente.",
          nuevaFotoPerfilUrl,
        });
      }
    );
  } catch (error) {
    console.error("Error al actualizar el perfil:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
});

export default router;
