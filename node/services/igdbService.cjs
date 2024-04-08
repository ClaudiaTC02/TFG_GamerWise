// import Logic
const {
  getGamesLogic,
  getLatestReleasesLogic,
  getUpcomingReleasesLogic,
  searchGameByNameLogic,
  getGameDetailsLogic,
} = require("../logic/igdbServiceLogic.cjs");

//----------------------------------------------------------------------
// HTTP Methods
//----------------------------------------------------------------------

// Obtain 10 games
const getGames = async (req, res) => {
  try {
    const result = await getGamesLogic();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get latest games releases
const getLatestReleases = async (req, res) => {
  try {
    const result = await getLatestReleasesLogic();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Coming soon games
const getUpcomingReleases = async (req, res) => {
  try {
    const result = await getUpcomingReleasesLogic();
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search a specific game
const searchGameByName = async (req, res) => {
  try {
    const { name } = req.query;
    const result = await searchGameByNameLogic(name);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(500).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Obtain details for a specific game
const getGameDetails = async (req, res) => {
  try {
    const { name } = req.query;
    const result = await getGameDetailsLogic(name);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  getGames,
  getLatestReleases,  
  getUpcomingReleases,
  searchGameByName,
  getGameDetails
};
