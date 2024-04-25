import { getGameRequest, postNewGameRequest } from "../api/game";
import { deleteRatingRequest, postNewRatingRequest } from "../api/rating";

export const newRatingLogic = async (id, token, gameDetails, value) => {
    try {
        const game = await getGameRequest(id, token);
        if (!game) {
          // Game not found create new game in db
          const company =
            gameDetails.involved_companies &&
            gameDetails.involved_companies
              .map((company) => company.company.name)
              .join(", ") || "anonymus";
          const platforms =
            gameDetails.platforms &&
            gameDetails.platforms
              .map((platforms) => platforms.abbreviation)
              .join(", ") || "none";
          const genres =
            gameDetails.genres &&
            gameDetails.genres.map((genre) => genre.name).join(", ") || "none";
          const multiplayer =
            gameDetails?.multiplayer_modes?.onlinemax || 1;
          const newGame = await postNewGameRequest(
            gameDetails.name,
            company,
            platforms,
            multiplayer,
            genres,
            id,
            token
          );
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