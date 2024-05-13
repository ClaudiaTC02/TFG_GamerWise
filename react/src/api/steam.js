import axios from "axios";
import { API } from "../utils/constants";

export const loginWithSteamRequest = async () => {
  try {
    const res = await axios.get(`${API}/steam`);
    console.log(res)
    return res;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};
