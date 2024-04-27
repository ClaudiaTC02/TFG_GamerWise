import { getAllListOfUserRequest, countGamesInListRequest } from "../api/list.js";

export const getListAndCountedGamesLogic = async (token) => {
    try {
        const lists = await getAllListOfUserRequest(token)
        if(lists.length === 0) return lists
        const listWithCount = await Promise.all(
            lists.map(async (list) => {
                const games = await countGamesInListRequest(list.id, token);
                return {
                    id: list.id,
                    name: list.name,
                    count: games
                };
            })
        );
        return listWithCount
    } catch (error) {
        throw new Error(error.response.data.message);
    }
}