require("dotenv").config();

const passport = require("passport");
const { Strategy: SteamStrategy } = require("passport-steam");

let UserModel; // Declara la variable UserModel

// Importa UserModel dinámicamente
import("../models/UserModel.js").then((module) => {
  UserModel = module.default; // Asigna el módulo importado a UserModel
});

passport.use(
  new SteamStrategy(
    {
      returnURL: "http://localhost:8000/steam",
      realm: "http://localhost:8000/",
      apiKey: process.env.STEAM_key,
    },
    function (identifier, profile, done) {
      createUserLogic(profile, done);
    }
  )
);

// Método para serializar el usuario
passport.serializeUser(function(user, done) {
  done(null, user.id);
});

// Método para deserializar el usuario
passport.deserializeUser(function(id, done) {
  UserModel.findByPk(id)
    .then(user => {
      done(null, user);
    })
    .catch(err => {
      done(err);
    });
});

async function createUserLogic(profile, done) {
  try {
    // Espera a que UserModel se haya cargado antes de usarlo
    while (!UserModel) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Espera 100 ms
    }

    let user = await UserModel.findOne({ where: { steam_token: profile.id } });
    const email = profile.emails && profile.emails.length > 0 ? profile.emails[0].value : null;
    console.log(profile.id)
    if (!user) {
      user = await UserModel.create({
        steam_token: profile.id,
        name: profile.displayName,
        email: email
      });
    }

    done(null, user);
  } catch (error) {
    done(error);
  }
}

module.exports = {
  passport,
};