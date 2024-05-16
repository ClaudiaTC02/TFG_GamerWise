// import Logic
const {
  getGamesLogic,
  getLatestReleasesLogic,
  getUpcomingReleasesLogic,
  searchGameByNameLogic,
  getGameDetailsLogic,
  searchGameWithFiltersLogic
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
    const { name, date } = req.query;
    const result = await searchGameByNameLogic(name, date);
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
    const { id } = req.query;
    const result = await getGameDetailsLogic(id);
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const searchGameWithFilters = async (req, res) => {
  try {
    const { name, category, platform } = req.query;
    console.log(name, category, platform)
    const result = await searchGameWithFiltersLogic({name, category, platform});
    if (result.success) {
      res.status(200).json(result.data);
    } else {
      res.status(404).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}

module.exports = {
  getGames,
  getLatestReleases,  
  getUpcomingReleases,
  searchGameByName,
  getGameDetails,
  searchGameWithFilters
};
