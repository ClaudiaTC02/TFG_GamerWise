
import { UserModel, ListModel, GameModel, PreferencesModel, ListGameModel, syncModels } from '../models/index.js';
import { generateAuthToken } from "../utils/userUtils.js";
import 'dotenv/config'

global.UserModel = UserModel;
global.ListModel = ListModel;
global.GameModel = GameModel;
global.ListGameModel = ListGameModel;
global.PreferencesModel = PreferencesModel;
global.authToken = generateAuthToken(process.env.JWT_test);
