import axios from 'axios';

const API = 'http://localhost:8000'

export const registerRequest = async (user) => {
    try {
        const res = await axios.post(`${API}/user`, user);
        return res.data;
    } catch (error) {
        console.log(error);
        throw new Error(error.response.data.message); 
    }
}