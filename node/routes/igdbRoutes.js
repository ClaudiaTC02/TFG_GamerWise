import {
    getGames,
    getLatestReleases,
    getUpcomingReleases,
    searchGameByName,
    getGameDetails,
    searchGameWithFilters
  } from "../services/igdbService.cjs";
import express from "express";

const router = express.Router();

router.get('/games', getGames);
router.get('/latest', getLatestReleases);
router.get('/upcoming', getUpcomingReleases);
router.get('/game', searchGameByName);
router.get('/gameDetails', getGameDetails);
router.get('/filter', searchGameWithFilters);


export default (app) => {app.use("/igdb", router)}