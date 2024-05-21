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
