import axios from "axios";
import { API } from "../utils/constants";

export const postNewRatingRequest = async (game_id, rating, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      game_id: game_id,
      rating: rating,
    };
    const res = await axios.post(`${API}/preferences`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
