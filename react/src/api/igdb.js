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