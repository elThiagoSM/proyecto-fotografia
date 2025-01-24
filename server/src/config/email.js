import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

transporter.verify((error, success) => {
  if (error) {
    console.error("Error al conectar con el servicio de correo:", error);
  } else {
    console.log("Conectado al servicio de correo.");
  }
});

export { transporter };
