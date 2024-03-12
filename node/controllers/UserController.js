//import Model
import UserModel from "../models/UserModel.js";
// security
import bcrypt from 'bcrypt'
import jwt from 'jsonwebtoken';
const saltRounds = 10;
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
        let hashedPassword = await hashPassword(password);
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
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

//----------------------------------------------------------------------
// Modular functions
//----------------------------------------------------------------------
const validateRequiredFields = (fields, requiredFields) => {
    for (let field of requiredFields) {
        if (!fields[field]) {
            return false;
        }
    }
    return true
}

const validateEmail = (email) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}

const validateDataTypes = (fields) => {
    const dataTypes = {
        email: "string",
        name: "string",
        password: "string"
    };
    for (let key in fields) {
        if (typeof fields[key] !== dataTypes[key]) {
        return false;
        }
    }
    return true;
};

const validatePassword = (password) => {
    // Verify length
    if (password.length < 8) {
      //throw new Error("Password must be at least 8 characters long");
        return false
    }
    // Verify symbols, uppercase and lowercase
    const uppercaseRegex = /[A-Z]/;
    const lowercaseRegex = /[a-z]/;
    const symbolRegex = /[$&+,:;=?@#|'<>.^*()%!-]/;
    if (!uppercaseRegex.test(password) || !lowercaseRegex.test(password) || !symbolRegex.test(password)) {
        //throw new Error("Password must contain at least one uppercase letter, one lowercase letter, and one symbol");
        return false
    }
    return true
};

const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw error; // Rechazar la promesa en caso de error
    }
};

const generateAuthToken = (userId) => {
    return jwt.sign({ userId }, 'eriwekhfoiqw', { expiresIn: '1h' });
};