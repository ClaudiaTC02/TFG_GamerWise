// import logic
import {
  addGameToListLogic,
  deleteGameFromListLogic,
  getAllGamesLogic,
  countGamesInListLogic,
} from "../logic/ListGameLogic.js";

//----------------------------------------------------------------------
// HTTP Methods
//----------------------------------------------------------------------

// add game to list
export const addGameToList = async (req, res) => {
  try {
    const { list_id, game_id } = req.body;
    const result = await addGameToListLogic(list_id, game_id);

    if (result.success) {
      res.status(201).json({ message: "Game added to list successfully" });
    } else {
      let statusCode = 400;
      if (result.error === "List or Game not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// delete game from list
export const deleteGameFromList = async (req, res) => {
  try {
    const { list_id, game_id } = req.params;
    const result = await deleteGameFromListLogic(list_id, game_id);

    if (result.success) {
      res.status(200).json({ message: "Game deleted from list successfully" });
    } else {
      let statusCode = 400;
      if (result.error === "List or Game not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtain all games and rating of a list
export const getAllGames = async (req, res) => {
  try {
    const { list_id } = req.params;
    const result = await getAllGamesLogic(list_id);

    if (result.success) {
      res
        .status(200)
        .json({ message: "Games obtained successfully", games: result.games });
    } else {
      let statusCode = 400;
      if (
        result.error === "List not found" ||
        result.error === "No games found for this list"
      ) {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// count games in list
export const countGamesInList = async (req, res) => {
  try {
    const { list_id } = req.params;
    const result = await countGamesInListLogic(list_id);

    if (result.success) {
      res
        .status(200)
        .json({
          message: "Game count obtained successfully",
          count: result.count,
        });
    } else {
      let statusCode = 400;
      if (result.error === "List not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
