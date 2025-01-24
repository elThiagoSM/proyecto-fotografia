import dotenv from "dotenv";
dotenv.config();

import express from "express";
import cors from "cors";
import bodyParser from "body-parser";
import session from "express-session";
import { dbConnect } from "./config/database.js";
import routes from "./routes/index.js";

const app = express();
const port = 5000;

app.use(express.json({ limit: "50mb" }));
app.use(express.urlencoded({ limit: "50mb", extended: true }));
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(
  session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

dbConnect();
app.use("/", routes);

app.use((err, req, res, next) => {
  console.error(err.stack);
  res
    .status(500)
    .send({ success: false, message: "Error interno del servidor." });
});

app.listen(port, () => {
  console.log(`Servidor corriendo en http://localhost:${port}`);
});
