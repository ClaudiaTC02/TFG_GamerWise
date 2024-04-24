import axios from "axios";
import { API } from "../utils/constants";

export const postNewGameRequest = async (name, company, platforms, max_players, gender, igdb_id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
        name: name,
        company: company,
        platforms: platforms,
        max_players: max_players,
        gender: gender,
        igdb_id: igdb_id
    };
    const res = await axios.post(`${API}/game`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getGameRequest = async (igdb_id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/game/${igdb_id}`, config);
    console.log(res.data)
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
