import axios from "axios";
import { API } from "../utils/constants";

export const getLandingRecommendations = async (token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/recommendations/landing`, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const getListRecommendations = async (token,list_id) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/recommendations/list/${list_id}`, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
