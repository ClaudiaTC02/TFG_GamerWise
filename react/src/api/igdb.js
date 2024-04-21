import axios from 'axios';
import { API } from '../utils/constants';

export const getLatestGamesRequest = async () => {
    try {
        const res = await axios.get(`${API}/igdb/latest`);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data.message); 
    }
}

export const getUpcommingGamesRequest = async () => {
    try {
        const res = await axios.get(`${API}/igdb/upcoming`);
        return res.data
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data.message); 
    }
}

export const getGameDetailsRequest = async (id) => {
    try {
        const res = await axios.get(`${API}/igdb/gameDetails?id=${id}`);
        return res.data
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data.message); 
    }
}

export const searchGame = async (name) => {
    try {
        const res = await axios.get(`${API}/igdb/game/?name=${name}`);
        const games = res.data
        const mappedGames = games?.map(game => ({
            id: game.id,
            name: game.name,
            year: game.first_release_date,
            cover: game.cover
          }))
        return mappedGames
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data.message); 
    }
}