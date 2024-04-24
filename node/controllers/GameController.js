//import Logic
import { createGameLogic, getGameLogic } from "../logic/GameLogic.js";

//----------------------------------------------------------------------
// HTTP Methods
//----------------------------------------------------------------------

// create a new Game
export const createGame = async (req, res) => {
    try {
        const { name, company, platforms, max_players, gender, igdb_id } = req.body;
        const { success, newGame, error } = await createGameLogic(name, company, platforms, max_players, gender, igdb_id);
        if (success) {
            res.status(201).json({ message: "Game created successfully", game: newGame });
        } else {
            res.status(400).json({ message: error });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// get game
export const getGame = async (req, res) => {
    try {
        const { igdb_id } = req.body;
        const { success, game, error } = await getGameLogic(igdb_id);
        if (success) {
            res.status(201).json({ message: "Game got successfully", game: game });
        } else if (error.message === "Game not found"){
            res.status(404).json({ message: error });
        } else{
            res.status(400).json({ message: error });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};