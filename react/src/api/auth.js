import axios from 'axios';
import { API } from '../utils/constants';

export const registerRequest = async (user) => {
    try {
        const res = await axios.post(`${API}/user`, user);
        return res.data;
    } catch (error) {
        throw new Error(error.response.data.message); 
    }
}

export const loginRequest = async (user) => {
    try {
        const res = await axios.post(`${API}/user/login`, user);
        return res.data
    } catch (error) {
        throw new Error(error.response.data.message); 
    }
}