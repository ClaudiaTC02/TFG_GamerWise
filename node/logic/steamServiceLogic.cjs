require("dotenv").config();

const passport = require("passport");
const { Strategy: SteamStrategy } = require("passport-steam");
// Importa dinámicamente
let GameModel;
import("../models/GameModel.js").then((module) => {
  GameModel = module.default;
});
// Importa dinámicamente
let getGameLogic;
import("./GameLogic.js").then((module) => {
  getGameLogic = module.getGameLogic;
});
// Importa dinámicamente
let addGameToListLogic;
import("./ListGameLogic.js").then((module) => {
  addGameToListLogic = module.addGameToListLogic;
});
// Importa dinámicamente
let getListByNameLogic;
import("./ListLogic.js").then((module) => {
  getListByNameLogic = module.getListByNameLogic;
});
// Importa dinámicamente
let getUserBySteamToken;
import("./UserLogic.js").then((module) => {
  getUserBySteamToken = module.getUserBySteamToken;
});
// Importa dinámicamente
let generateAuthToken;
import("../utils/userUtils.js").then((module) => {
  generateAuthToken = module.generateAuthToken;
});
// Importa dinámicamente
let searchGameByNameLogic;
import("./igdbServiceLogic.cjs").then((module) => {
  searchGameByNameLogic = module.searchGameByNameLogic;
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
    while (!UserModel || !ListModel || !GameModel) {
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
      await obtainGamesLogic(profile.id);
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
    await obtainGamesLogic(profile.id);
    return { success: true, updatedUser };
  } catch (error) {
    return { success: false, error: error };
  }
}

async function obtainGamesLogic(steamId) {
  const apiKey = process.env.STEAM_key;
  try {
    const juegosUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;
    const juegosResponse = await fetch(juegosUrl);
    const juegosData = await juegosResponse.json();
    if (juegosData.response && juegosData.response.games) {
      const juegosPromises = juegosData.response.games.map(
        async (juego, index) => {
          await new Promise((resolve) => setTimeout(resolve, index * 250));
          const [gameName, releaseDate] = await obtainGamesDetailsLogic(
            juego.appid
          );
          if (gameName && releaseDate) {
            const id = await searchGameByNameLogic(gameName, releaseDate);
            const details = id.data;
            if (details) {
              await postInfoInDataBase(steamId, details);
            }
            return details;
          }
        }
      );

      return Promise.all(juegosPromises);
    } else {
      throw new Error("No se pudieron obtener los juegos del usuario.");
    }
  } catch (error) {
    console.error("Error al obtener los juegos:", error);
    return null;
  }
}

// Función para obtener detalles de un juego por su ID de aplicación
async function obtainGamesDetailsLogic(appid) {
  const detallesJuegoUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`;

  try {
    const response = await fetch(detallesJuegoUrl);
    const data = await response.json();

    if (data && data[appid] && data[appid].success) {
      return [data[appid].data.name, data[appid].data.release_date.date];
    } else {
      return [null, null];
    }
  } catch (error) {
    return [null, null];
  }
}

async function postInfoInDataBase(token, gameDetails) {
  try {
    const game = await getGameDataBase(gameDetails)
    const user = await getUserBySteamToken(token);
    const list = await getListByNameLogic("Like", user.user.id);
    await addGameToListLogic(list.list.id, game.id);
  } catch (error) {
    console.error(`No se pudo incluir en la base de datos`, error);
  }
}

async function getGameDataBase(gameDetails) {
  const company =
    (gameDetails.involved_companies &&
      gameDetails.involved_companies
        .map((company) => company.company.name)
        .join(", ")) ||
    "anonymus";
  const platforms =
    (gameDetails.platforms &&
      gameDetails.platforms
        .map((platforms) => platforms.abbreviation)
        .join(", ")) ||
    "none";
  const genres =
    (gameDetails.genres &&
      gameDetails.genres.map((genre) => genre.name).join(", ")) ||
    "none";
  const multiplayer = gameDetails?.multiplayer_modes?.[0]?.onlinemax || 1;
  try {
    const game = await getGameLogic(gameDetails.id);
    return game.game[0];
  } catch (error) {
    const newGame = await GameModel.create({
      name: gameDetails.name,
      company,
      platforms,
      max_players: multiplayer,
      gender: genres,
      igdb_id: gameDetails.id,
    });
    return newGame;
  }
}

module.exports = {
  passport,
  createUserLogic,
  linkSteamAccount,
};
