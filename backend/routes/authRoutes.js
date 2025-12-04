import express from "express";
import controller from "../controllers/authController.js";

const r = express.Router();

r.post("/registrar", controller.register);  // agora existe
r.post("/login", controller.login);         // agora existe
r.put("/update/:id", controller.update);

export default r;
