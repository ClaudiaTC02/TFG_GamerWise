import PreferencesModel from "../models/PreferencesModel.js";
import GameModel from "../models/GameModel.js";
import UserModel from "../models/UserModel.js";

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// add rating to a game
export const addRatingLogic = async (user_id, game_id, rating) => {
  try {
    user_id = Number(user_id);
    game_id = Number(game_id);

    if (!user_id || rating === null || rating === undefined || !game_id) {
      throw new Error("Required fields not provided");
    }
    rating = Number(rating);
    if (!Number.isInteger(rating) || rating < 1 || rating > 5) {
      throw new Error("Rating has to be an integer between 1 and 5");
    }

    const user = await UserModel.findByPk(user_id);
    const game = await GameModel.findByPk(game_id);

    if (!user || !game) {
      throw new Error("User or Game not found");
    }

    const newRating = await PreferencesModel.create({
      user_id: user_id,
      game_id: game_id,
      rating: rating,
    });

    return { success: true, rating: newRating };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// update preference
export const updateRatingLogic = async (user_id, game_id, rating) => {
  try {
    user_id = Number(user_id);
    game_id = Number(game_id);

    if (!user_id || !game_id) {
      throw new Error("Ids are required and in number format");
    }

    if (typeof rating !== "number") {
      throw new Error("Invalid rating data type");
    }

    const user = await UserModel.findByPk(user_id);
    const game = await GameModel.findByPk(game_id);

    if (!user || !game) {
      throw new Error("User or Game not found");
    }

    const preferenceExists = await validateIfExists(user_id, game_id);

    if (!preferenceExists) {
      throw new Error("User or Game not found in model");
    }

    await PreferencesModel.update(
      { rating },
      {
        where: { game_id: game_id, user_id: user_id },
      }
    );

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// delete ratings
export const deleteRatingLogic = async (user_id, game_id) => {
  try {
    user_id = Number(user_id);
    game_id = Number(game_id);

    if (!user_id || !game_id) {
      throw new Error("Ids are required and in number format");
    }

    const preferenceExists = await validateIfExists(user_id, game_id);

    if (!preferenceExists) {
      throw new Error("User or Game not found in model");
    }

    await PreferencesModel.destroy({
      where: { user_id: user_id, game_id: game_id },
    });

    return { success: true };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// obtain rating of a specific game
export const getRatingOfGameLogic = async (user_id, game_id) => {
  try {
    user_id = Number(user_id);
    game_id = Number(game_id);

    if (!user_id || !game_id) {
      throw new Error("Ids are required and in number format");
    }

    const preferenceExists = await validateIfExists(user_id, game_id);

    if (!preferenceExists) {
      throw new Error("User or Game not found in model");
    }

    const rating = await PreferencesModel.findOne({
      attributes: ["rating"],
      where: { user_id: user_id, game_id: game_id },
    });

    return { success: true, rating: rating };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// obtain all ratings of a user
export const getAllRatingLogic = async (user_id) => {
  try {
    user_id = Number(user_id);

    if (!user_id) {
      throw new Error("Ids are required and in number format");
    }

    const user = await UserModel.findByPk(user_id);

    if (!user) {
      throw new Error("User not found");
    }

    const ratings = await PreferencesModel.findAll({
      attributes: ["rating"],
      where: { user_id: user_id },
    });

    const ratingValues = ratings.map((rating) => rating.rating);
    const ratingCounts = {
      1: 0,
      2: 0,
      3: 0,
      4: 0,
      5: 0,
    };
    ratingValues.forEach((value) => {
      if (ratingCounts.hasOwnProperty(value)) {
        ratingCounts[value]++;
      }
    });

    return { success: true, ratings: ratingCounts };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

//----------------------------------------------------------------------
// Modular functions
//----------------------------------------------------------------------

const validateIfExists = async (user_id, game_id) => {
  const preference = await PreferencesModel.findOne({
    where: { user_id: user_id, game_id: game_id },
  });
  return !!preference;
};
