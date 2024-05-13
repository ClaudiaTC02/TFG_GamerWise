const { passport } = require("../logic/steamServiceLogic.cjs");

const loginWithSteam = (req, res, next) => {
  passport.authenticate("steam", (err, authInfo) => {
    if (err) {
      return res.status(500).send("Error durante la autenticación");
    }
    console.log("Hola")
    const { user, token } = authInfo;
    console.log(user, token);
    res.redirect(`http://localhost:5173/steam/${token}`);
  })(req, res, next);
};

// esto no va xd
const callbackSteam = (req, res) => {
  const { user, token } = req;
  //res.redirect(`http://localhost:5173/steam/${user}/${token}`);
}

module.exports = {
  loginWithSteam,
  callbackSteam
};
