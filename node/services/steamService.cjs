const { passport, createUserLogic, linkSteamAccount } = require("../logic/steamServiceLogic.cjs");

// Importa dinámicamente
let getUserId;
import("../utils/auth.js").then((module) => {
  getUserId = module.getUserId;
});

const loginWithSteam = (req, res, next) => {
  passport.authenticate("steam", async (err, authInfo) => {
    if (err) {
      return res.status(500).send("Error durante la autenticación");
    }
    const { profile } = authInfo;
    try {
      const { success, user, token } = await createUserLogic(profile);
      if (success) {
        res.redirect(`http://localhost:5173/steam/${token}`);
      } else {
        return res.status(500).send("Error al crear el usuario");
      }
    } catch (error) {
      return res.status(500).send("Error interno del servidor");
    }
  })(req, res, next);
};

const linkWithSteam = (req, res, next) => {
  passport.authenticate("steam-link",async (err, authInfo) => {
    
    if (err) {
      return res.status(500).send("Error durante la autenticación");
    }
    const steamToken = req.cookies.steamToken;
    const user_id = getUserId(steamToken.token);
    console.log(user_id)
    const { profile } = authInfo;
    try {
      const { success, updateduser } = await linkSteamAccount(profile, user_id);
      if (success) {
        res.redirect(`http://localhost:5173/profile`);
      } else {
        return res.status(500).send("Error al crear el usuario");
      }
    } catch (error) {
      console.log(error.message)
      return res.status(500).send("Error interno del servidor");
    }
  })(req, res, next);
};

// esto no va xd
const callbackSteam = (req, res) => {
  const { user, token } = req;
  //res.redirect(`http://localhost:5173/steam/${user}/${token}`);
};

module.exports = {
  loginWithSteam,
  callbackSteam,
  linkWithSteam,
};
