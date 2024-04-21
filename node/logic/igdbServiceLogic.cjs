const apicalypse = require("apicalypse").default;
require('dotenv').config();

const requestOptions = {
  method: "post",
  baseURL: "https://api.igdb.com/v4",
  headers: {
    'Client-ID': `${process.env.IGDB_client_id}`,
    'Authorization': `Bearer ${process.env.IGBD_authorization}`,
    'Content-Type': "text/plain",
  },
  responseType: "json",
  timeout: 10000,
};

// Obtain 10 games
const getGamesLogic = async () => {
  try {
    const response = await apicalypse(requestOptions)
      .fields("name")
      .limit(10)
      .request("/games");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get latest games releases
const getLatestReleasesLogic = async () => {
  try {
    const currentTime = Math.floor(Date.now()/ 1000);
    const oneWeekBefore = currentTime - (7 * 24 * 60 * 60);
    const response = await apicalypse(requestOptions)
      .fields("game.name, game.platforms.abbreviation, game.cover.url, date, game.first_release_date")
      .where(`game.first_release_date > ${oneWeekBefore} & game.first_release_date < ${currentTime} & date < ${currentTime} & game.version_title = null`)
      .limit(20)
      .sort("date", "desc")
      .request("/release_dates");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Coming soon games
const getUpcomingReleasesLogic = async () => {
  try {
    const currentTime = Math.floor(Date.now()/ 1000);
    const oneWeekAfter = currentTime + (7 * 24 * 60 * 60);
    const response = await apicalypse(requestOptions)
      .fields("game.name, game.platforms.abbreviation, game.cover.url, date, game.first_release_date")
      .where(`game.first_release_date < ${oneWeekAfter} & game.first_release_date > ${currentTime} & date > ${currentTime}`)
      .limit(30)
      .sort("date", "asc")
      .request("/release_dates");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Search a specific game
const searchGameByNameLogic = async (name) => {
  try {
    const response = await apicalypse(requestOptions)
      .fields("*, cover.url")
      .search(name)
      .limit(10)
      .request("/games");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtain details for a specific game
const getGameDetailsLogic = async (id) => {
  try {
    const response = await apicalypse(requestOptions)
      .fields("name, summary, cover.url, platforms.abbreviation, involved_companies.company.name, genres.name, multiplayer_modes.onlinecoopmax, multiplayer_modes.onlinemax")
      .where(`id = ${id}`)
      .limit(1)
      .request("/games");
    const game = response.data[0];
    if (!game) {
      return { success: false, error: "Game not found" };
    }
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

module.exports = {
  getGamesLogic,
  getLatestReleasesLogic,  
  getUpcomingReleasesLogic,
  searchGameByNameLogic,
  getGameDetailsLogic
};

