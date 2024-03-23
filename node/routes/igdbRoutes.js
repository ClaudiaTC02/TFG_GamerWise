import {
    getGames,
    getLatestReleases,
    getUpcomingReleases,
    searchGameByName,
  } from "../services/igdbService.cjs";
import express from "express";

const router = express.Router();

router.get('/games', getGames);
router.get('/latest', getLatestReleases);
router.get('/upcoming', getUpcomingReleases);
router.get('/game', searchGameByName);

export default (app) => {app.use("/igdb", router)}