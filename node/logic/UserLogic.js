import UserModel from "../models/UserModel.js";
import bcrypt from 'bcrypt';
import { validateRequiredFields, validateEmail, validateDataTypes, validatePassword, hashPassword, generateAuthToken } from '../utils/userUtils.js';

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// Create user logic
export const createUserLogic = async (email, name, password) => {
  try {
    if (!validateRequiredFields({ email, name, password },['email', 'name', 'password'])) {
      throw new Error("Required fields");
    }

    if (!validateDataTypes({ email, name, password })) {
      throw new Error("Invalid data type");
    }

    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    if(!validatePassword(password)) {
      throw new Error("Invalid password format, It must contain uppercase, lowercase, symbol and >= 8 length");
    }

    const hashedPassword = await hashPassword(password);
    await UserModel.create({ email, name, password: hashedPassword });
    return { success: true };
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
      return { success: false, error: "Email already exists" };
    }
    return { success: false, error: error.message };
  }
};

// Login logic
export const loginLogic = async (email, password) => {
  try {
    if (!validateRequiredFields({ email, password },['email', 'password'])) {
      throw new Error("Required fields");
    }

    if (!validateDataTypes({ email, password })) {
      throw new Error("Invalid data type");
    }

    if (!validateEmail(email)) {
      throw new Error("Invalid email format");
    }

    const user = await UserModel.findOne({
      where: { email: email }
    });

    if (!user || !(await bcrypt.compare(password, user.password))) {
      throw new Error("User not found or incorrect password");
    }

    const token = generateAuthToken(user.id);
    return { success: true, user, token };
  } catch (error) {
    return { success: false, error: error.message };
  }
};

// Get basic information by id logic
export const getBasicInfoLogic = async (id) => {
  try {
    id = Number(id);
    if (!id) {
      throw new Error("Required id in number format");
    }

    const user = await UserModel.findByPk(id);
    if (!user) {
      throw new Error("User not found");
    }

    return { success: true, info: { name: user.name } };
  } catch (error) {
    return { success: false, error: error.message };
  }
};
