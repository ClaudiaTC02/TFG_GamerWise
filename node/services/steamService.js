import { passport, createUserLogic, linkSteamAccount } from "../logic/steamServiceLogic.js";
import { getUserId } from "../utils/auth.js";

// Inicia el flujo de inicio de sesión redirigiendo a Steam
export const loginWithSteam = (req, res, next) => {
  passport.authenticate("steam")(req, res, next);
};

// Recibe la respuesta de Steam para el inicio de sesión
export const loginSteamCallback = (req, res, next) => {
  passport.authenticate("steam", { session: false }, async (err, authInfo) => {
    if (err || !authInfo) {
      return res.status(500).send("Error durante la autenticación con Steam");
    }
    const { profile } = authInfo;
    try {
      const { success, user, token } = await createUserLogic(profile);
      if (success) {
        return res.redirect(`http://localhost:5173/steam/${token}`);
      } else {
        return res.status(500).send("Error al crear el usuario");
      }
    } catch (error) {
      return res.status(500).send(error.message);
    }
  })(req, res, next);
};

// Inicia el flujo para vincular la cuenta
export const linkWithSteam = (req, res, next) => {
  passport.authenticate("steam-link")(req, res, next);
};

// Recibe la respuesta de Steam para la vinculación
export const linkSteamCallback = (req, res, next) => {
  passport.authenticate("steam-link", { session: false }, async (err, authInfo) => {
    if (err || !authInfo) {
      return res.status(500).send("Error durante la vinculación");
    }

    const steamToken = req.cookies.steamToken;
    if (!steamToken || !steamToken.token) {
      return res.status(401).send("Token de vinculación no encontrado o caducado");
    }

    try {
      const user_id = getUserId(steamToken.token);
      const { profile } = authInfo;
      const { success } = await linkSteamAccount(profile, user_id);
      
      if (success) {
        return res.redirect(`http://localhost:5173/profile`);
      } else {
        return res.status(500).send("Error al vincular la cuenta");
      }
    } catch (error) {
      console.error(error.message);
      return res.status(500).send("Error interno del servidor");
    }
  })(req, res, next);
};