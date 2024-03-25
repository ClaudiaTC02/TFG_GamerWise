import express from "express";
import { addRating, updateRating, deleteRating, getRatingOfGame } from "../controllers/PreferencesController.js"
const router = express.Router();

router.post('/', addRating)
router.put('/:game_id&:user_id', updateRating)
router.delete('/:game_id&:user_id', deleteRating)
router.get('/:game_id&:user_id', getRatingOfGame)

export default (app) => {app.use("/preferences", router)}