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

export const updateNameRequest = async (name, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      name: name
    }
    const res = await axios.put(`${API}/user`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};


export const updateEmailRequest = async (email, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      email: email
    }
    const res = await axios.put(`${API}/user`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

