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

export const getGameRecommendations = async (token,igdb_id, name, company, genre, platforms) => {
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
      genre: genre,
      igdb_id: igdb_id
  };
    const res = await axios.post(`${API}/recommendations/game`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
