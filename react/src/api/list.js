import axios from "axios";
import { API } from "../utils/constants";

export const getAllListOfUserRequest = async (token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/list/user`, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const countGamesInListRequest = async (list_id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/listgame/${list_id}/count`, config);
    return res.data.count;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const addGameToListRequest = async (list_id, game_id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      list_id: list_id,
      game_id: game_id,
    }
    const res = await axios.post(`${API}/listgame`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
