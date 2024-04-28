import { getGameRequest } from "../api/game.js";
import {
  getAllListOfUserRequest,
  countGamesInListRequest,
  addGameToListRequest,
  getAllGamesOfListRequest,
} from "../api/list.js";
import { createGameLogic } from "./gameLogic.js";

export const getListAndCountedGamesLogic = async (token, igdb_id) => {
  try {
    const lists = await getAllListOfUserRequest(token);
    if (lists.length === 0) return lists;
    const listWithCount = await Promise.all(
      lists.map(async (list) => {
        const games = await countGamesInListRequest(list.id, token);
        const existsInList = await checkIfGameExistsInListLogic(games, list.id, token, igdb_id)
        return {
          id: list.id,
          name: list.name,
          count: games,
          exists: existsInList
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
    throw new Error(error.response.data.message);
  }
};

export const checkIfGameExistsInListLogic = async (count, list_id, token, id) => {
    try {
      if(count === 0) return false
      const game = await getGameRequest(id, token);
      if(!game) return false;
      const games = await getAllGamesOfListRequest(list_id, token);
      for (const key in games) {
        if (Object.hasOwnProperty.call(games, key) && games[key].lists) {
          for (const listItem of games[key].lists) {
            if (listItem.list_game.game_id === game.game[0].id) {
              return true; 
            }
          }
        }
      }
      return false;
    } catch (error) {
      throw new Error(error.response.data.message);
    }
};