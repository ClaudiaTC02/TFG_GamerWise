import express from "express";
import { createGame, getGame } from "../controllers/GameController.js"
import { verifyToken } from '../utils/auth.js'
const router = express.Router();

router.post('/', verifyToken, createGame)
router.get('/', verifyToken, getGame)

export default (app) => {app.use("/game", router)}