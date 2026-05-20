import express from "express";
import {
  loginWithSteam,
  loginSteamCallback,
  linkWithSteam,
  linkSteamCallback
} from "../services/steamService.js";

const router = express.Router();

// Rutas de Autenticación / Login
router.get("/", loginWithSteam);
router.get("/callback", loginSteamCallback);

// Rutas de Vinculación de cuenta
router.get("/link/:token", (req, res, next) => {
  const { token } = req.params;
  if (!token) {
    return res.status(400).send("Token no proporcionado");
  }
  // Guardamos el token actual en una cookie segura para identificar al usuario al volver de Steam
  res.cookie("steamToken", { token }, { maxAge: 900000, httpOnly: true });
  next();
}, linkWithSteam);

router.get("/linkcallback", linkSteamCallback);

export default (app) => {
  app.use("/steam", router);
};