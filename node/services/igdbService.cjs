// igdbService.cjs
const apicalypse = require("apicalypse").default;

const requestOptions = {
  method: "post",
  baseURL: "https://api.igdb.com/v4",
  headers: {
    'Client-ID': "fxn4rmr2l1llkcbhttzlkmxsy08nhr",
    'Authorization': "Bearer smr23q8lfu4n016hsja70b0i2az2y3",
    'Content-Type': "text/plain",
  },
  responseType: "json",
  timeout: 10000,
};

// Obtain 10 games
const getGames = async (req, res) => {
  try {
    const response = await apicalypse(requestOptions)
      .fields("name")
      .limit(10)
      .request("/games");
    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get latest games releases
const getLatestReleases = async (req, res) => {
  try {
    const currentTime = Math.floor(Date.now()/ 1000)
    const response = await apicalypse(requestOptions)
      .fields("game.name, date")
      .where(`date < ${currentTime}`)
      .limit(10)
      .sort("date", "desc")
      .request("/release_dates");

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Comming soon games
const getUpcomingReleases = async (req, res) => {
  try {
    const currentTime = Math.floor(Date.now()/ 1000)
    const response = await apicalypse(requestOptions)
      .fields("game.name, date")
      .where(`date > ${currentTime}`)
      .limit(10)
      .sort("date", "asc")
      .request("/release_dates");

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// search a specific game
const searchGameByName = async (req, res) => {
  try {
    const name = req.query.name;
    const response = await apicalypse(requestOptions)
      .fields("name, cover.url")
      .search(name)
      .limit(10)
      .request("/games");

    res.status(200).json(response.data);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGames,
  getLatestReleases,
  getUpcomingReleases,
  searchGameByName,
};
