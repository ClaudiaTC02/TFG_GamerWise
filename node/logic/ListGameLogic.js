import ListGameModel from "../models/ListGameModel.js";
import GameModel from "../models/GameModel.js";
import ListModel from "../models/ListModel.js";
import PreferencesModel from "../models/PreferencesModel.js";

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// add a game to list
export const addGameToListLogic = async (list_id, game_id) => {
  try {
    list_id = Number(list_id);
    game_id = Number(game_id);

    if (!list_id || !game_id) {
      throw new Error("Required fields not provided");
    }

    // get the list and game
    const list = await ListModel.findOne({ where: { id: list_id } });
    const game = await GameModel.findByPk(game_id);

    if (!list || !game) {
      throw new Error("List or Game not found");
    }

    await list.addGame(game);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// delete game from list
export const deleteGameFromListLogic = async (list_id, game_id) => {
  try {
    list_id = Number(list_id);
    game_id = Number(game_id);

    if (!list_id || !game_id) {
      throw new Error("Required fields not provided");
    }

    // get the list and game
    const list = await ListModel.findOne({ where: { id: list_id } });
    const game = await GameModel.findByPk(game_id);

    if (!list || !game) {
      throw new Error("List or Game not found");
    }

    await list.removeGame(game);
    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// obtain all games and rating of a list
export const getAllGamesLogic = async (list_id) => {
  try {
    list_id = Number(list_id);

    if (!list_id) {
      throw new Error("Required fields not provided");
    }

    // get list
    const list = await ListModel.findByPk(list_id);
    if (!list) {
      throw new Error("List not found");
    }

    const user_id = list.user_id;

    // get all games with rating
    const games = await GameModel.findAll({
      attributes: [
        "id",
        "name",
        "company",
        "gender",
        "platforms",
        "max_players",
        "igdb_id"
      ],
      include: [
        {
          model: ListModel,
          where: { id: list_id },
          through: { model: ListGameModel },
        },
        {
          model: PreferencesModel,
          attributes: ["rating"],
          where: { user_id },
          required: false,
        },
      ],
    });

    if (games.length === 0) {
      throw new Error("No games found for this list");
    }

    return { success: true, games };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// count games in list
export const countGamesInListLogic = async (list_id) => {
  try {
    list_id = Number(list_id);

    if (!list_id) {
      throw new Error("List ID is required in number format");
    }

    // get list
    const list = await ListModel.findByPk(list_id);
    if (!list) {
      throw new Error("List not found");
    }

    const gameCount = await ListGameModel.count({
      where: { list_id: list_id },
    });
    return { success: true, count: gameCount };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
