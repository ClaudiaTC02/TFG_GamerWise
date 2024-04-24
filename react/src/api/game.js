import axios from "axios";
import { API } from "../utils/constants";

export const postNewGameRequest = async (name, company, platforms, max_players, gender, token) => {
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
        gender: gender
    };
    const res = await axios.post(`${API}/game`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
