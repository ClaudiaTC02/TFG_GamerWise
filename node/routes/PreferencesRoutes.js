import express from "express";
import { verifyToken } from '../utils/auth.js'
import { addRating, updateRating, deleteRating, getRatingOfGame, getAllRating, getGamesWithSpecificRating } from "../controllers/PreferencesController.js"
const router = express.Router();

router.post('/',verifyToken, addRating)
router.put('/:game_id&:user_id',verifyToken, updateRating)
router.delete('/:game_id&:user_id', verifyToken,deleteRating)
router.get('/:game_id&:user_id',verifyToken, getRatingOfGame)
router.get('/:user_id',verifyToken, getAllRating)
router.get('/games/:user_id',verifyToken, getGamesWithSpecificRating)

export default (app) => {app.use("/preferences", router)}