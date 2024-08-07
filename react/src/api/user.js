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

export const updatePasswordRequest = async (password, anterior, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      password: password,
      password_before : anterior
    }
    const res = await axios.put(`${API}/user`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteAccountRequest = async (token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete(`${API}/user`, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};

export const deleteSteamRequest = async (token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      steam_token: null,
    }
    const res = await axios.put(`${API}/user/steam`, data, config);
    return res;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
};



