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
    const response = await apicalypse(requestOptions)
      .fields("game.name, game.platforms.abbreviation, game.cover.url")
      .where(`date < ${currentTime}`)
      .limit(10)
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
    const response = await apicalypse(requestOptions)
      .fields("game.name, date")
      .where(`date > ${currentTime}`)
      .limit(10)
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
      .fields("name, cover.url")
      .search(name)
      .limit(10)
      .request("/games");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtain details for a specific game
const getGameDetailsLogic = async (name) => {
  try {
    const response = await apicalypse(requestOptions)
      .fields("name, platforms.abbreviation, involved_companies.company.name, genres.name, multiplayer_modes.onlinecoopmax, multiplayer_modes.onlinemax")
      .search(name)
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

