import express from "express";
import { addRating, updateRating, deleteRating, getRatingOfGame, getAllRating } from "../controllers/PreferencesController.js"
const router = express.Router();

router.post('/', addRating)
router.put('/:game_id&:user_id', updateRating)
router.delete('/:game_id&:user_id', deleteRating)
router.get('/:game_id&:user_id', getRatingOfGame)
router.get('/:user_id', getAllRating)

export default (app) => {app.use("/preferences", router)}