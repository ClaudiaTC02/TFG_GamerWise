import jwt from 'jsonwebtoken';
import bcrypt from 'bcrypt'
const saltRounds = 10;
import 'dotenv/config'
//----------------------------------------------------------------------
// Modular functions
//----------------------------------------------------------------------
export const validateRequiredFields = (fields, requiredFields) => {
    for (let field of requiredFields) {
        if (!fields[field]) {
            return false;
        }
    }
    return true
}

export const validateEmail = (email) =>{
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email)
}

export const validateDataTypes = (fields) => {
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

export const validateDataTypesUpdate = (fields) => {
    const dataTypesUpdate = {
        email: ["string", "undefined"],
        name: ["string", "undefined"],
        password: ["string", "undefined"]
    };
    for (let key in fields) {
        if (!dataTypesUpdate[key] || (!dataTypesUpdate[key].includes(typeof fields[key]))) {
            return false;
        }
    }
    return true;
};

export const validatePassword = (password) => {
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

export const hashPassword = async (password) => {
    try {
        const hash = await bcrypt.hash(password, saltRounds);
        return hash;
    } catch (error) {
        throw error; // Rechazar la promesa en caso de error
    }
};

export const generateAuthToken = (userId) => {
    return jwt.sign({ userId }, `${process.env.JWT_token_secret}`, { expiresIn: '1h' });
};