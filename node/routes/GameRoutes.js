import express from "express";
import { createGame } from "../controllers/GameController.js"
const router = express.Router();

router.post('/', createGame)

export default (app) => {app.use("/game", router)}