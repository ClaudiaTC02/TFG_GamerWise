// import Logic
import {
  createListLogic,
  getAllListLogic,
  updateListLogic,
  deleteListLogic,
  getListLogic,
  getListByNameLogic
} from "../logic/ListLogic.js";
import { getUserIdFromToken } from '../utils/auth.js';

//----------------------------------------------------------------------
// HTTP Methods
//----------------------------------------------------------------------

// create a list
export const createList = async (req, res) => {
  try {
    const { name, description } = req.body;
    
    const user_id = getUserIdFromToken(req);
    
    const result = await createListLogic(name, description, Number(user_id));
    if (result.success) {
      res
        .status(201)
        .json({ message: "List created successfully", list: result.newList });
    } else {
      let statusCode = 400;
      if (result.error === "The user does not exist") {
        statusCode = 404;
      }
      return res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtain all list from a user
export const getAllList = async (req, res) => {
  try {
    const user_id = getUserIdFromToken(req);

    const result = await getAllListLogic(Number(user_id));
    if (result.success) {
      res.status(200).json(result.allLists);
    } else {
      let statusCode = 400;
      if (result.error === "User not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// update an existing list
export const updateList = async (req, res) => {
  try {
    const { name, description } = req.body;
    const { id } = req.params;
    const result = await updateListLogic(name, description, Number(id));
    if (result.success) {
      res.status(200).json({ message: "List updated successfully" });
    } else {
      let statusCode = 400;
      if (result.error === "List not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// deleting list
export const deleteList = async (req, res) => {
  try {
    const { id } = req.params;
    const result = await deleteListLogic(Number(id));
    if (result.success) {
      res.status(200).json({ message: "List deleted successfully" });
    } else {
      let statusCode = 400;
      if (result.error === "List not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// obtatin list
export const getList = async (req, res) => {
  try {
    const { id } = req.params;
    const user_id = getUserIdFromToken(req);
    const result = await getListLogic(Number(id), Number(user_id));
    if (result.success) {
        res.status(200).json({message: "List obtained successfully", list: result.list});
    } else {
      let statusCode = 400;
      if (result.error === "List not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    // Internal server error
    res.status(500).json({ message: error.message });
  }
};

// obtatin list by name
export const getListByName = async (req, res) => {
  try {
    const { name } = req.params;
    const user_id = getUserIdFromToken(req);
    const result = await getListByNameLogic(name, Number(user_id));
    if (result.success) {
        res.status(200).json({message: "List obtained successfully", list: result.list});
    } else {
      let statusCode = 400;
      if (result.error === "List not found") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    // Internal server error
    res.status(500).json({ message: error.message });
  }
};

