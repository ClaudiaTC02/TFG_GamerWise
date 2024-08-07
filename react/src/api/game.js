import axios from "axios";
import { API } from "../utils/constants";

export const postNewGameRequest = async (name, company, platforms, max_players, gender, igdb_id, cover, release_date, token) => {
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
        igdb_id: igdb_id,
        cover: cover,
        release_date: release_date
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
    return res.data;
  } catch (error) {
    if (error.response.status === 404) {
      // Game not found
      return null;
    } else {
      throw new Error(error.response.data.message);
    }
  }
};
