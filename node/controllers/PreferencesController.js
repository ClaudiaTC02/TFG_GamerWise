// import Logic
import {
  addRatingLogic,
  updateRatingLogic,
  deleteRatingLogic,
  getRatingOfGameLogic,
  getAllRatingLogic,
  getGamesWithSpecificRatingLogic
} from '../logic/PreferencesLogic.js';
import { getUserIdFromToken } from '../utils/auth.js';

//----------------------------------------------------------------------
// HTTP Methods
//----------------------------------------------------------------------

// add rating to a game
export const addRating = async (req, res) => {
  try {
    const { game_id, rating } = req.body;

    const user_id = getUserIdFromToken(req);
    
    const result = await addRatingLogic(user_id, game_id, rating);

    if (result.success) {
      res.status(201).json({ message: "Rating added successfully", rating: result.rating });
    } else {
      let statusCode = 400;
      if (result.error === "User or Game not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update preference
export const updateRating = async (req, res) => {
  try {
    const { rating } = req.body;
    const { game_id } = req.params;

    const user_id = getUserIdFromToken(req);

    const result = await updateRatingLogic(user_id, game_id, rating);

    if (result.success) {
      res.status(200).json({ message: "Rating updated successfully" });
    } else {
      let statusCode = 400;
      if (result.error === "User or Game not found" || result.error === "User or Game not found in model") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deleting ratings
export const deleteRating = async (req, res) => {
  try {
    const { game_id } = req.params;

    const user_id = getUserIdFromToken(req);

    const result = await deleteRatingLogic(user_id, game_id);

    if (result.success) {
      res.status(200).json({ message: "Rating deleted successfully" });
    } else {
      let statusCode = 400;
      if (result.error === "User or Game not found in model") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtain rating of a especific game
export const getRatingOfGame = async (req, res) => {
  try {
    const { game_id } = req.params;

    const user_id = getUserIdFromToken(req);

    const result = await getRatingOfGameLogic(user_id, game_id);

    if (result.success) {
      res.status(200).json({ message: "Rating obtained successfully", rating: result.rating });
    } else {
      let statusCode = 400;
      if (result.error === "User or Game not found in model") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obain all ratings of a user
export const getAllRating = async (req, res) => {
  try {
    const user_id = getUserIdFromToken(req);

    const result = await getAllRatingLogic(user_id);

    if (result.success) {
      res.status(200).json({ message: "Ratings obtained successfully", ratings: result.ratings });
    } else {
      let statusCode = 400;
      if (result.error === "User not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get all the games with specific rating
// /preferences/games/:user_id?rating=:rating
export const getGamesWithSpecificRating = async (req, res) => {
  try {
    const {rating} = req.query

    const user_id = getUserIdFromToken(req);
    
    const result = await getGamesWithSpecificRatingLogic(user_id, rating)

    if(result.success) {
      res.status(200).json({ message: "Games obtained successfully", games: result.games });
    } else{
      let statusCode = 400;
      if(result.error === 'User not found') {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error })
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}
