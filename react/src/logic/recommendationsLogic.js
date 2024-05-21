import { getGameDetailsRequest } from "../api/igdb";
import { getLandingRecommendations } from "../api/recommendations";

export const getLandingRecommendationsLogic = async (token) => {
  try {
    const recommendations = await getLandingRecommendations(token);
    const gameDetailsPromises = recommendations.map(async (game) => {
      const details = await getGameDetailsRequest(game.gameId);
      return {
        game: {...details[0]},
      };
    });
    const detailedRecommendations = await Promise.all(gameDetailsPromises)
    return detailedRecommendations;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
