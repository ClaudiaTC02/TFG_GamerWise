import express from "express";
import { createGame, getGame, getAllGames } from "../controllers/GameController.js"
import { verifyToken } from '../utils/auth.js'
const router = express.Router();

router.post('/', verifyToken, createGame)
router.get('/:igdb_id', verifyToken, getGame)
router.get('/', getAllGames)

export default (app) => {app.use("/game", router)}