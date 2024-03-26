//import Model
import UserModel from "../models/UserModel.js";
// security
import bcrypt from 'bcrypt'
//import modular functions
import { validateRequiredFields, validateEmail, validateDataTypes, validatePassword, hashPassword, generateAuthToken } from '../utils/userUtils.js';
//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// Create user
export const createUser = async (req, res) => {
  try {
    let { email, name, password } = req.body;
    // validation
    if (!validateRequiredFields({ email, name, password },['email', 'name', 'password'])) {
        return res.status(400).json({ message: "Required fields"})
    }

    if (!validateDataTypes({ email, name, password })) {
        return res.status(400).json({ message: "Invalid data type"})
    }

    if (!validateEmail(email)) {
        return res.status(400).json({ message: "Invalid email format"})
    }

    if(!validatePassword(password)) {
        return res.status(400).json({ message: "Invalid password format, It must contain uppercase, lowercase, symbol and >= 8 length"})
    }
    let hashedPassword = await hashPassword(password);
    // create user
    await UserModel.create({ email, name, password:hashedPassword });
    res.status(201).json({ message: "User created successfully" });
  } catch (error) {
    if (error.name === 'SequelizeUniqueConstraintError') {
        return res.status(400).json({ message: "Email already exists" });
    }
    // Internal server error
    res.status(500).json({ message: error.message });
  }
};

// Search user
export const login = async (req, res) =>{
    try {
        let { email, password} = req.body
        // validation
        if (!validateRequiredFields({ email, password },['email', 'password'])) {
            return res.status(400).json({ message: "Required fields"})
        }
        if (!validateDataTypes({ email, password })) {
            return res.status(400).json({ message: "Invalid data type"})
        }
        if (!validateEmail(email)) {
            return res.status(400).json({ message: "Invalid email format"})
        }
        let user = await UserModel.findOne({
            where: { email: email}
        })
        if (!user || !(await bcrypt.compare(password, user.password))) {
            return res.status(404).json({ message: "User not found or incorrect password" });
        }
        //auth token
        const token = generateAuthToken(user.id);
        res.status(200).json({user, token})
    } catch (error) {
        console.log(error.message);
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

// get basic information by id
export const getBasicInfo = async (req, res) => {
    try {
        let { id } = req.params;
        id = Number(id);
        if (!id) {
            return res.status(400).json({ message: "Required id in number format" });
        }
        const user = await UserModel.findByPk(id);
        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }
        res.status(200).json({ message: "Information obtained successfully", info: { name: user.name } });
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
};
