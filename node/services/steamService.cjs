const { passport } = require("../logic/steamServiceLogic.cjs");

const loginWithSteam = passport.authenticate("steam", { failureRedirect: "/" });

module.exports = {
  loginWithSteam,
};
