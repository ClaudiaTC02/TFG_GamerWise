//import axios from "axios";
import { API } from "../utils/constants";

export const loginWithSteamRequest = async () => {
  try {
    window.location.href=`${API}/steam`
    /*const res = await axios.get(`${API}/steam`, { headers: { 'Origin': 'http://localhost:5173/' } });
    console.log(res)
    return res;*/
  } catch (error) {
    //throw new Error(error.response.data.message);
    console.log(error)
  }
};

export const linkWithSteamRequest = async (token) => {
  try {
    window.location.href=`${API}/steam/link/${token}`
    /*const res = await axios.get(`${API}/steam`, { headers: { 'Origin': 'http://localhost:5173/' } });
    console.log(res)
    return res;*/
  } catch (error) {
    //throw new Error(error.response.data.message);
    console.log(error)
  }
};
