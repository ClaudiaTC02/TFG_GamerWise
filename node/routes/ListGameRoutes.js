import { authenticateToken } from '../utils/auth.js'
import express from "express";
import { addGameToList, deleteGameFromList, getAllGames, countGamesInList } from "../controllers/ListGameController.js"
const router = express.Router();

router.post('/', addGameToList)
router.delete('/:list_id&:game_id', deleteGameFromList)
router.get('/:list_id', getAllGames)
router.get('/:list_id/count', countGamesInList)

export default (app) => {app.use("/listgame", router)}