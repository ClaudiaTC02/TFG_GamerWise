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

export const getAllGamesOfListRequest = async (list_id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/listgame/${list_id}`, config);
    return res.data.games;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const getListOfAUserRequest = async (name, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/list/name/${name}`, config);
    return res.data.list;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const deleteListRequest = async (id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete(`${API}/list/${id}`, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const getListRequest = async (id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.get(`${API}/list/${id}`, config);
    return res.data.list;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const deleteGameFromListRequest = async (list_id, game_id, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const res = await axios.delete(`${API}/listgame/${list_id}&${game_id}`, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const updateListRequest = async (list_id, datos, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      name: datos.name,
      description: datos.description
    }
    const res = await axios.put(`${API}/list/${list_id}`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}

export const createListRequest = async (datos, token) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
    };
    const data = {
      name: datos.name,
      description: datos.description
    }
    const res = await axios.post(`${API}/list`, data, config);
    return res.data;
  } catch (error) {
    throw new Error(error.response.data.message);
  }
}