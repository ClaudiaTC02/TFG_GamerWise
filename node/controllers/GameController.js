//import Model
import GameModel from "../models/GameModel.js";
import ListGameModel from "../models/ListGameModel.js";
import PreferencesModel from "../models/PreferencesModel.js";

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// create a new Game
export const createGame = async (req, res) => {
    try {
        let {name, company, platforms, max_players, gender} = req.body
        if(!validateRequiredFields({name, company, platforms, max_players, gender})){
            return res.status(400).json({message: "Required fields are not provided"})
        }
        if(!validateDataTypes({name, company, platforms, max_players, gender})){
            return res.status(400).json({message: "Invalid data type"})
        }
        const newGame = await GameModel.create({name: name, company: company, platforms: platforms, max_players: max_players, gender: gender})
        res.status(201).json({message:"Game created successfully", game: newGame})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

//----------------------------------------------------------------------
// Modular functions
//----------------------------------------------------------------------

const validateDataTypes = (fields) => {
    const dataTypes = {
        name: "string",
        company: "string",
        platforms: "string",
        max_players: "number",
        gender: "string"
    };
    for (let key in fields) {
        if (!dataTypes[key] || (typeof fields[key] !== dataTypes[key] && !dataTypes[key].includes(typeof fields[key]))) {
            return false;
        }
    }
    return true;
};

export const validateRequiredFields = (fields) => {
    const requiredFields = ["name","company","platforms","max_players","gender"]
    for (let field of requiredFields) {
        if (!fields[field]) {
            return false;
        }
    }
    return true
}