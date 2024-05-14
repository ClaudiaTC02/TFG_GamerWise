/**
 *
 * NOMBRE: app.js
 * AUTORA: Claudia Torres Cruz
 * FECHA: 28/02/2024
 * DESCRIPCIÓN: En este fichero se encuentra la lógica verdadera encargada de recoger datos de la base de datos
 *
 */
import "dotenv/config";
import express from "express";
import cors from "cors";
import cookieParser from 'cookie-parser';
import session from "express-session";
import passport from "passport";
// conection db
import db from "./database/db.js";
import {
  UserModel,
  ListModel,
  GameModel,
  PreferencesModel,
  ListGameModel,
  syncModels,
} from "./models/index.js";
// import router
import userRoutes from "./routes/UserRoutes.js";
import listRoutes from "./routes/ListRoutes.js";
import gameRoutes from "./routes/GameRoutes.js";
import listgameRoutes from "./routes/ListGameRoutes.js";
import preferencesRoutes from "./routes/PreferencesRoutes.js";
import steamRoutes from "./routes/SteamRoutes.js";
// import services
import igdbRoutes from "./routes/igdbRoutes.js";
import "dotenv/config";

syncModels();

const app = express();

app.use(cors());
app.use(cookieParser());
app.use(express.json());
app.use(
  session({
    secret: `${process.env.EXPRESS_sesion_secret}`,
    resave: false,
    saveUninitialized: false,
  })
);
app.use(passport.initialize());
app.use(passport.session());

preferencesRoutes(app); // preferencesRoutes will execute in /preferences
listgameRoutes(app); // listgameRoutes will execute in /listgame
gameRoutes(app); // gameRoutes will execute in /game
igdbRoutes(app); // igdbRoutes will execute in /igdb
userRoutes(app); // userRoutes will execute in /user
listRoutes(app); // listRoutes will execute in /list
steamRoutes(app); // steamRoutes will execute in /steam

try {
  await db.authenticate();
  console.log("Conexion exitoa a la base de datos");
} catch (error) {
  console.log(`El error de conexion es: ${error}`);
}

app.listen(8000, () => {
  console.log("Server UP running in http://localhost:8000/");
});
