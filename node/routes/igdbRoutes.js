import {
    getGames,
    getLatestReleases,
    getUpcomingReleases,
    searchGameByName,
    getGameDetails
  } from "../services/igdbService.cjs";
import express from "express";

const router = express.Router();

router.get('/games', getGames);
router.get('/latest', getLatestReleases);
router.get('/upcoming', getUpcomingReleases);
router.get('/game', searchGameByName);
router.get('/gameDetails', getGameDetails);

export default (app) => {app.use("/igdb", router)}