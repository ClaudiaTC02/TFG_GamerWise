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

export const getRatingRequest = async (game_id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/preferences/rating/${game_id}`, config);
    return res.data.rating.rating;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteRatingRequest = async (game_id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete(`${API}/preferences/${game_id}`, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const updateRatingRequest = async (game_id, newRating, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      rating: newRating,
    };
    const res = await axios.put(`${API}/preferences/${game_id}`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
