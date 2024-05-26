import express from "express";
import { verifyToken } from '../utils/auth.js'
import { landingRecommendations } from "../recommender/recommender.js"
const router = express.Router();

router.get('/landing',verifyToken, landingRecommendations)

export default (app) => {app.use("/recommendations", router)}