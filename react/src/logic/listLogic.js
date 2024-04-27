import { getGameRequest } from "../api/game.js";
import {
  getAllListOfUserRequest,
  countGamesInListRequest,
  addGameToListRequest,
} from "../api/list.js";
import { createGameLogic } from "./gameLogic.js";

export const getListAndCountedGamesLogic = async (token) => {
  try {
    const lists = await getAllListOfUserRequest(token);
    if (lists.length === 0) return lists;
    const listWithCount = await Promise.all(
      lists.map(async (list) => {
        const games = await countGamesInListRequest(list.id, token);
        return {
          id: list.id,
          name: list.name,
          count: games,
        };
      })
    );
    return listWithCount;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const addGameToListLogic = async (list_id, gameDetails, id, token) => {
  try {
    const game = await getGameRequest(id, token);
    if (!game) {
      // Game not found create new game in db
      const newGame = await createGameLogic(gameDetails, id, token);
      await addGameToListRequest(list_id, newGame.game.id, token);
    } else {
      await addGameToListRequest(list_id, game.game[0].id, token);
    }
  } catch (error) {
    console.error("Error al manejar el cambio de calificación:", error);
  }
};
