import express from "express";
import { createGame } from "../controllers/GameController.js"
import { verifyToken } from '../utils/auth.js'
const router = express.Router();

router.post('/', verifyToken, createGame)

export default (app) => {app.use("/game", router)}