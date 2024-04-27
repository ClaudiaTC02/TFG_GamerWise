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
    console.log(res.data);
    return res.data.count;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};