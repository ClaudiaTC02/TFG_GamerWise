import express from "express";
import { verifyToken } from '../utils/auth.js'
import { landingRecommendations } from "../recommender/recommender.js"
import { listRecommendations } from "../recommender/contentRecommender.js";
import { gameRecommendations } from "../recommender/hybridRecommender.js";
const router = express.Router();

router.get('/landing',verifyToken, landingRecommendations)
router.get('/list/:list_id',verifyToken, listRecommendations)
router.post('/game', verifyToken, gameRecommendations)

export default (app) => {app.use("/recommendations", router)}