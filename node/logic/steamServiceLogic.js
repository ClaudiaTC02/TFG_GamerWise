import passport from "passport";
import { Strategy as SteamStrategy } from "passport-steam";
import dotenv from "dotenv";

import GameModel from "../models/GameModel.js";
import UserModel from "../models/UserModel.js";
import ListModel from "../models/ListModel.js";
import { getGameLogic } from "./GameLogic.js";
import { addGameToListLogic } from "./ListGameLogic.js";
import { getListByNameLogic } from "./ListLogic.js";
import { getUserBySteamToken } from "./UserLogic.js";
import { generateAuthToken } from "../utils/userUtils.js";
import { searchGameByNameLogic } from "./igdbServiceLogic.js";

dotenv.config();

// Estrategia para Login
passport.use(
  "steam",
  new SteamStrategy(
    {
      returnURL: "http://localhost:8000/steam/callback",
      realm: "http://localhost:8000/",
      apiKey: process.env.STEAM_key,
    },
    (identifier, profile, done) => {
      done(null, {
        profile: {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
        },
      });
    },
  ),
);

// Estrategia para Vincular Cuenta
passport.use(
  "steam-link",
  new SteamStrategy(
    {
      returnURL: "http://localhost:8000/steam/linkcallback",
      realm: "http://localhost:8000/",
      apiKey: process.env.STEAM_key,
    },
    (identifier, profile, done) => {
      done(null, {
        profile: {
          id: profile.id,
          displayName: profile.displayName,
          emails: profile.emails,
        },
      });
    },
  ),
);

passport.serializeUser((user, done) => {
  done(null, user.id);
});

passport.deserializeUser(async (id, done) => {
  try {
    const user = await UserModel.findByPk(id);
    done(null, user);
  } catch (err) {
    done(err);
  }
});

// Lógica de negocio: Crear usuario si no existe al loguearse con Steam
export async function createUserLogic(profile) {
  try {
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

      // Crear las listas por defecto del sistema GamerWise
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
        name: "Favorites",
        user_id: user.id,
        description: "Games that I Liked",
      });
      await ListModel.create({
        name: "Dropped",
        user_id: user.id,
        description: "Games dropped",
      });
      await ListModel.create({
        name: "Owned",
        user_id: user.id,
        description: "Games that I own",
      });

      // Importar sus juegos de Steam en segundo plano de manera asíncrona
      obtainGamesLogic(profile.id);
    }

    const token = generateAuthToken(user.id);
    return { success: true, user, token };
  } catch (error) {
    console.error(error.message);
    return { success: false, error };
  }
}

// Lógica de negocio: Vincular Steam a una cuenta ya creada
export async function linkSteamAccount(profile, userId) {
  try {
    const user = await UserModel.findByPk(userId);
    if (!user) throw new Error("User not found");
    if (user.steam_token)
      throw new Error("User is already linked with a Steam account");

    const existingUser = await UserModel.findOne({
      where: { steam_token: profile.id },
    });
    if (existingUser)
      throw new Error("Another user is already linked with this Steam account");

    user.steam_token = profile.id;
    const updatedUser = await user.save();

    // Importar juegos de Steam en segundo plano
    obtainGamesLogic(profile.id);
    return { success: true, updatedUser };
  } catch (error) {
    return { success: false, error: error.message };
  }
}

// Consumir la API de Steam para traer la librería del usuario
async function obtainGamesLogic(steamId) {
  const apiKey = process.env.STEAM_key;
  try {
    const juegosUrl = `https://api.steampowered.com/IPlayerService/GetOwnedGames/v0001/?key=${apiKey}&steamid=${steamId}&format=json`;
    const juegosResponse = await fetch(juegosUrl);
    const juegosData = await juegosResponse.json();

    if (juegosData.response && juegosData.response.games) {
      const juegosPromises = juegosData.response.games.map(
        async (juego, index) => {
          // Delay incremental de 250ms para no saturar con peticiones consecutivas a la API de Steam
          await new Promise((resolve) => setTimeout(resolve, index * 250));
          const [gameName] = await obtainGamesDetailsLogic(juego.appid);

          if (gameName) {
            const id = await searchGameByNameLogic(gameName);
            const details = id.data;
            if (details) {
              await postInfoInDataBase(steamId, details);
            }
            return details;
          }
        },
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

async function obtainGamesDetailsLogic(appid) {
  const detallesJuegoUrl = `https://store.steampowered.com/api/appdetails?appids=${appid}`;
  try {
    const response = await fetch(detallesJuegoUrl);
    const data = await response.json();
    if (data && data[appid] && data[appid].success) {
      return [data[appid].data.name, data[appid].data.release_date.date];
    }
    return [null, null];
  } catch (error) {
    return [null, null];
  }
}

async function postInfoInDataBase(token, gameDetails) {
  try {
    const game = await getGameDataBase(gameDetails);
    const user = await getUserBySteamToken(token);
    const list = await getListByNameLogic("Owned", user.user.id);
    await addGameToListLogic(list.list.id, game.id);
  } catch (error) {
    console.error(`No se pudo incluir en la base de datos`, error);
  }
}

async function getGameDataBase(gameDetails) {
  const company =
    gameDetails.involved_companies?.map((c) => c.company.name).join(", ") ||
    "anonymous";
  const platforms =
    gameDetails.platforms?.map((p) => p.abbreviation).join(", ") || "none";
  const genres = gameDetails.genres?.map((g) => g.name).join(", ") || "none";
  const multiplayer = gameDetails?.multiplayer_modes?.[0]?.onlinemax || 1;
  const cover = gameDetails.cover ? gameDetails.cover.url : null;
  const release_date = gameDetails?.first_release_date || 0;

  try {
    const game = await getGameLogic(gameDetails.id);
    return game.game[0];
  } catch (error) {
    return await GameModel.create({
      name: gameDetails.name,
      company,
      platforms,
      max_players: multiplayer,
      gender: genres,
      cover,
      release_date,
      igdb_id: gameDetails.id,
    });
  }
}

export { passport };
