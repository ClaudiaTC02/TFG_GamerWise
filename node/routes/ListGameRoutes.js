import { verifyToken } from '../utils/auth.js'
import express from "express";
import { addGameToList, deleteGameFromList, getAllGames, countGamesInList } from "../controllers/ListGameController.js"
const router = express.Router();

router.post('/',verifyToken, addGameToList)
router.delete('/:list_id&:game_id', verifyToken, deleteGameFromList)
router.get('/:list_id', verifyToken, getAllGames)
router.get('/:list_id/count',verifyToken, countGamesInList)

export default (app) => {app.use("/listgame", router)}