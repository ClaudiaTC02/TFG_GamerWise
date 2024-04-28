import axios from "axios";
import { API } from "../utils/constants";

export const getBasicInfoRequest = async (token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/user`, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
