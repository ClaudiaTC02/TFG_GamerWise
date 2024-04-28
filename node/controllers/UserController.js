// import logic
import {
  createUserLogic,
  loginLogic,
  getBasicInfoLogic,
  updateUserLogic,
  deleteUserLogic,
} from "../logic/UserLogic.js";
import { getUserIdFromToken } from "../utils/auth.js";

//----------------------------------------------------------------------
// HTTP Methods
//----------------------------------------------------------------------

// Create user
export const createUser = async (req, res) => {
  try {
    const { email, name, password } = req.body;
    const result = await createUserLogic(email, name, password);
    if (result.success) {
      res.status(201).json({ message: "User created successfully" });
    } else {
      res.status(400).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Search user
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const result = await loginLogic(email, password);
    if (result.success) {
      res.status(200).json({ user: result.user, token: result.token });
    } else {
      let statusCode = 400;
      if (result.error === "User not found or incorrect password") {
        statusCode = 404;
      }
      res.status(statusCode).json({ message: result.error });
    }
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// get basic information by id
export const getBasicInfo = async (req, res) => {
  try {
    const id = getUserIdFromToken(req);
    const result = await getBasicInfoLogic(id);

    if (result.success) {
      res.status(200).json({
        message: "Information obtained successfully",
        info: result.info,
      });
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

// update a user
export const updateUser = async (req, res) => {
  try {
    const id = getUserIdFromToken(req);
    const { name, email, password } = req.body;
    const result = await updateUserLogic(id, { name, email, password });
    if (result.success) {
      res
        .status(200)
        .json({ message: "User updated successfully", user: result.user });
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

// delete a user
export const deleteUser = async (req, res) => {
  try {
    const id = getUserIdFromToken(req);
    const result = await deleteUserLogic(id);
    if (result.success) {
      res
        .status(200)
        .json({ message: "User deleted successfully"});
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
