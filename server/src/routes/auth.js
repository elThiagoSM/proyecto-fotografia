import express from "express";
import bcrypt from "bcrypt";
import { transporter } from "../config/email.js";
import { db } from "../config/database.js";

const router = express.Router();

// Ruta para registrar usuarios
router.post("/register", async (req, res) => {
  const { nombre_completo, nombre_usuario, email, contrasena, tipo } = req.body;

  if (!nombre_completo || !nombre_usuario || !email || !contrasena || !tipo) {
    return res.status(400).json({
      success: false,
      message: "Todos los campos son obligatorios.",
    });
  }

  if (!["cliente", "fotografo"].includes(tipo)) {
    return res.status(400).json({
      success: false,
      message: "El tipo debe ser 'cliente' o 'fotografo'.",
    });
  }

  try {
    // Generar contraseña encriptada
    const hashedPassword = await bcrypt.hash(contrasena, 10);

    // Generar un token de verificación (6 dígitos)
    const tokenVerificacion = Math.floor(
      100000 + Math.random() * 900000
    ).toString();

    // Insertar usuario en la base de datos
    const sql = `
      INSERT INTO usuarios 
      (nombre_completo, nombre_usuario, email, hash_contrasena, tipo, token_verificacion) 
      VALUES (?, ?, ?, ?, ?, ?)
    `;
    db.query(
      sql,
      [
        nombre_completo,
        nombre_usuario,
        email,
        hashedPassword,
        tipo,
        tokenVerificacion,
      ],
      async (err, result) => {
        if (err) {
          console.error("Error al registrar el usuario:", err);
          return res.status(500).json({
            success: false,
            message: "Error al registrar el usuario. Inténtalo de nuevo.",
          });
        }

        // Enviar correo de verificación
        const mailOptions = {
          from: "tu_email@gmail.com", // Cambia por tu correo
          to: email,
          subject: "Verificación de correo electrónico",
          text: `Hola ${nombre_completo}, tu código de verificación es: ${tokenVerificacion}`,
        };

        try {
          await transporter.sendMail(mailOptions);
          res.status(201).json({
            success: true,
            message:
              "Usuario registrado. Verifica tu correo para activar tu cuenta.",
          });
        } catch (mailError) {
          console.error("Error al enviar el correo:", mailError);
          res.status(500).json({
            success: false,
            message:
              "Usuario registrado, pero no se pudo enviar el correo de verificación.",
          });
        }
      }
    );
  } catch (error) {
    console.error("Error en el servidor:", error);
    res.status(500).json({
      success: false,
      message: "Error interno del servidor.",
    });
  }
});

// Ruta para verificar el correo electrónico
router.post("/verify-email", (req, res) => {
  const { email, codigo } = req.body;

  if (!email || !codigo) {
    return res.status(400).json({
      success: false,
      message: "Correo y código de verificación son obligatorios.",
    });
  }

  const sql = `
    SELECT id FROM usuarios 
    WHERE email = ? AND token_verificacion = ?
  `;
  db.query(sql, [email, codigo], (err, results) => {
    if (err) {
      console.error("Error al verificar el correo:", err);
      return res.status(500).json({
        success: false,
        message: "Error interno del servidor.",
      });
    }

    if (results.length === 0) {
      return res.status(400).json({
        success: false,
        message: "Código de verificación incorrecto o expirado.",
      });
    }

    const updateSql = `
      UPDATE usuarios 
      SET correo_verificado = true, token_verificacion = NULL 
      WHERE email = ?
    `;
    db.query(updateSql, [email], (err) => {
      if (err) {
        console.error("Error al actualizar el estado de verificación:", err);
        return res.status(500).json({
          success: false,
          message: "Error al completar la verificación.",
        });
      }

      res.status(200).json({
        success: true,
        message: "Correo verificado exitosamente.",
      });
    });
  });
});

// Ruta de inicio de sesión
router.post("/login", (req, res) => {
  const { email, contrasena } = req.body;

  if (!email || !contrasena) {
    return res.status(400).json({
      success: false,
      message: "Correo y contraseña son obligatorios.",
    });
  }

  const sql = `
    SELECT * FROM usuarios 
    WHERE email = ?
  `;
  db.query(sql, [email], (err, results) => {
    if (err) {
      console.error("Error al buscar usuario:", err);
      return res.status(500).json({
        success: false,
        message: "Error al procesar el inicio de sesión.",
      });
    }

    if (results.length === 0) {
      return res
        .status(401)
        .json({ success: false, message: "Correo o contraseña incorrectos." });
    }

    const user = results[0];

    bcrypt.compare(contrasena, user.hash_contrasena, (err, isMatch) => {
      if (err) {
        console.error("Error al verificar la contraseña:", err);
        return res
          .status(500)
          .json({ success: false, message: "Error interno." });
      }

      if (!isMatch) {
        return res.status(401).json({
          success: false,
          message: "Correo o contraseña incorrectos.",
        });
      }

      if (!user.correo_verificado) {
        return res.status(403).json({
          success: false,
          message:
            "Por favor, verifica tu correo electrónico antes de iniciar sesión.",
        });
      }

      const { hash_contrasena, token_verificacion, ...userData } = user;

      res.status(200).json({
        success: true,
        message: "Inicio de sesión exitoso.",
        user: userData,
      });
    });
  });
});

export default router;
