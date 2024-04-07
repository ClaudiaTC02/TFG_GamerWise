//import Logic
import { createGameLogic } from "../logic/GameLogic.js";

//----------------------------------------------------------------------
// HTTP Methods
//----------------------------------------------------------------------

// create a new Game
export const createGame = async (req, res) => {
    try {
        const { name, company, platforms, max_players, gender } = req.body;
        const { success, newGame, error } = await createGameLogic(name, company, platforms, max_players, gender);
        if (success) {
            res.status(201).json({ message: "Game created successfully", game: newGame });
        } else {
            res.status(400).json({ message: error });
        }
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};