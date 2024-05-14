require("dotenv").config();

const passport = require("passport");
const { Strategy: SteamStrategy } = require("passport-steam");

// Importa dinámicamente
let generateAuthToken;
import("../utils/userUtils.js").then((module) => {
  generateAuthToken = module.generateAuthToken;
});
// Importa dinámicamente
let UserModel;
import("../models/UserModel.js").then((module) => {
  UserModel = module.default;
});
// Importa dinámicamente
let ListModel;
import("../models/ListModel.js").then((module) => {
  ListModel = module.default;
});

const steamLoginStrategy = new SteamStrategy(
  {
    returnURL: "http://localhost:8000/steam/callback",
    realm: "http://localhost:8000/",
    apiKey: process.env.STEAM_key,
  },
  function (identifier, profile, done) {
    getData(profile, done);
  }
);
passport.use("steam", steamLoginStrategy);

const steamLinkStrategy = new SteamStrategy(
  {
    returnURL: "http://localhost:8000/steam/linkcallback",
    realm: "http://localhost:8000/",
    apiKey: process.env.STEAM_key,
  },
  function (identifier, profile, done) {
    getData(profile, done);
  }
);

passport.use("steam-link", steamLinkStrategy);

// Método para serializar el usuario
passport.serializeUser(function (user, done) {
  done(null, user.id);
});

// Método para deserializar el usuario
passport.deserializeUser(function (id, done) {
  UserModel.findByPk(id)
    .then((user) => {
      done(null, user);
    })
    .catch((err) => {
      done(err);
    });
});

async function getData(profile, done) {
  try {
    done(null, {
      profile: {
        id: profile.id,
        displayName: profile.displayName,
        emails: profile.emails,
      },
    });
  } catch (error) {
    done(error);
  }
}

async function createUserLogic(profile) {
  try {
    // Espera a que UserModel se haya cargado antes de usarlo
    while (!UserModel || !ListModel) {
      await new Promise((resolve) => setTimeout(resolve, 100)); // Espera 100 ms
    }

    let user = await UserModel.findOne({ where: { steam_token: profile.id } });
    const email =
      profile.emails && profile.emails.length > 0
        ? profile.emails[0].value
        : null;
    if (!user) {
      user = await UserModel.create({
        steam_token: profile.id,
        name: profile.displayName,
        email: email,
      });
      await ListModel.create({
        name: "Playing",
        user_id: user.id,
        description: "Games currently Playing",
      });
      await ListModel.create({
        name: "Completed",
        user_id: user.id,
        description: "Games Completed",
      });
      await ListModel.create({
        name: "Like",
        user_id: user.id,
        description: "Games that I Liked",
      });
      await ListModel.create({
        name: "Dropped",
        user_id: user.id,
        description: "Games dropped",
      });
    }
    const token = generateAuthToken(user.id);
    return { success: true, user, token };
  } catch (error) {
    console.log(error.message);
    return { success: false, error: error };
  }
}

async function linkSteamAccount(profile, userId) {
  try {
    while (!UserModel) {
      await new Promise((resolve) => setTimeout(resolve, 100));
    }
    let user = await UserModel.findByPk(userId);
    if (!user) {
      throw new Error("User not found");
    }
    // Verifica si ya está vinculado con Steam
    if (user.steam_token) {
      throw new Error("User is already linked with a Steam account");
    }
    const existingUser = await UserModel.findOne({
      where: { steam_token: profile.id },
    });
    if (existingUser) {
      throw new Error("Another user is already linked with this Steam account");
    }
    user.steam_token = profile.id;
    const updatedUser = await user.save();
    return { success: true, updatedUser };
  } catch (error) {
    return { success: false, error: error };
  }
}

module.exports = {
  passport,
  createUserLogic,
  linkSteamAccount,
};
