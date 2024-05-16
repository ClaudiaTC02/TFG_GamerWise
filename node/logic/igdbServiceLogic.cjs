const apicalypse = require("apicalypse").default;
require("dotenv").config();

const requestOptions = {
  method: "post",
  baseURL: "https://api.igdb.com/v4",
  headers: {
    "Client-ID": `${process.env.IGDB_client_id}`,
    Authorization: `Bearer ${process.env.IGBD_authorization}`,
    "Content-Type": "text/plain",
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
    const currentTime = Math.floor(Date.now() / 1000);
    const oneWeekBefore = currentTime - 7 * 24 * 60 * 60;
    const response = await apicalypse(requestOptions)
      .fields(
        "game.name, game.platforms.abbreviation, game.cover.url, date, game.first_release_date"
      )
      .where(
        `game.first_release_date > ${oneWeekBefore} & game.first_release_date < ${currentTime} & date < ${currentTime} & game.version_title = null`
      )
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
    const currentTime = Math.floor(Date.now() / 1000);
    const oneWeekAfter = currentTime + 7 * 24 * 60 * 60;
    const response = await apicalypse(requestOptions)
      .fields(
        "game.name, game.platforms.abbreviation, game.cover.url, date, game.first_release_date"
      )
      .where(
        `game.first_release_date < ${oneWeekAfter} & game.first_release_date > ${currentTime} & date > ${currentTime}`
      )
      .limit(30)
      .sort("date", "asc")
      .request("/release_dates");
    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Search a specific game
const searchGameByNameLogic = async (name, dateString) => {
  const date = new Date(dateString);
  date.setMonth(0);
  date.setDate(1); 
  const marcaTiempoUnixInicio = date.getTime() / 1000;
  date.setMonth(11);
  date.setDate(31); 
  const marcaTiempoUnixFinal = date.getTime() / 1000;
  try {
    const response = await apicalypse(requestOptions)
      .fields(
        "name, platforms.abbreviation, involved_companies.company.name, genres.name, multiplayer_modes.onlinemax, first_release_date"
      )
      .search(name)
      .where(`first_release_date <= ${marcaTiempoUnixFinal} & platforms=(6)`)
      .limit(1)
      .request("/games");
    return { success: true, data: response.data[0] };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// search a game with filter
const searchGameWithFiltersLogic = async ({
  name,
  category,
  platform,
  rating,
  ...otherFilters
}) => {
  try {
    let apicalypseQuery = apicalypse(requestOptions).fields("*, cover.url");

    const whereClauses = [];
    if (name) {
      apicalypseQuery = apicalypseQuery.search(name);
    }
    if (category) {
      whereClauses.push(`genres.name = "${category}"`);
    }
    if (platform) {
      whereClauses.push(`platforms.name = "${platform}"`);
    }

    if (whereClauses.length > 0) {
      const concatenatedWhere = whereClauses.join(" & ");
      apicalypseQuery = apicalypseQuery.where(concatenatedWhere);
    }

    const response = await apicalypseQuery.limit(40).request("/games");

    return { success: true, data: response.data };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Obtain details for a specific game
const getGameDetailsLogic = async (id) => {
  try {
    const response = await apicalypse(requestOptions)
      .fields(
        "name, summary, cover.url, platforms.abbreviation, involved_companies.company.name, genres.name, multiplayer_modes.onlinecoopmax, multiplayer_modes.onlinemax, first_release_date"
      )
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
  getGameDetailsLogic,
  searchGameWithFiltersLogic,
};
