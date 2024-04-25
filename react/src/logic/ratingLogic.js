import { getGameRequest } from "../api/game";
import { deleteRatingRequest, postNewRatingRequest, updateRatingRequest } from "../api/rating";
import { createGameLogic } from "./gameLogic";

export const newRatingLogic = async (id, token, gameDetails, value) => {
    try {
        const game = await getGameRequest(id, token);
        if (!game) {
          // Game not found create new game in db
          const newGame = await createGameLogic(gameDetails, id, token);
          await postNewRatingRequest(newGame.game.id, value, token);
        } else {
          await postNewRatingRequest(game.game[0].id, value, token);
        }
      } catch (error) {
        console.error("Error al manejar el cambio de calificación:", error);
      }
}

export const deleteRatingLogic = async (id, token) => {
  try {
    const game = await getGameRequest(id, token);
    if(game){
      await deleteRatingRequest(game.game[0].id, token)
    }
  } catch (error) {
    console.error("Error al manejar el cambio de calificación:", error);
  }
}

export const updateRatingLogic = async (id, newRating, token) => {
  try {
    const game = await getGameRequest(id, token);
    if(game){
      await updateRatingRequest(game.game[0].id, newRating, token)
    }
  } catch (error) {
    console.error("Error al manejar el cambio de calificación:", error);
  }
}