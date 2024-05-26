import { getGameDetailsRequest } from "../api/igdb";
import { getLandingRecommendations, getListRecommendations } from "../api/recommendations";

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

export const getListRecommendationsLogic = async (token, list_id) => {
  try {
    const recommendations = await getListRecommendations(token, list_id);
    const mappedGameData = recommendations.map(game => ({
      game: {
          id: game.igdb_id,
          name: game.name,
          cover: { url: game.cover },
          first_release_date: game.release_date,
          genres: game.gender.split(',').map(genre => ({ name: genre.trim() })),
          platforms: game.platforms.split(',').map(platform => ({ name: platform.trim() })),
      }
  }));
  return mappedGameData
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}
