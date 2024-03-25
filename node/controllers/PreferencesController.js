import PreferencesModel from '../models/PreferencesModel.js'
import GameModel from "../models/GameModel.js";
import UserModel from "../models/UserModel.js";

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// add rating to a game
export const addRating = async (req, res) => {
    try {
        let { user_id, game_id, rating } = req.body
        user_id = Number(user_id)
        game_id = Number(game_id)
        if(!user_id || !rating || !game_id){
            return res.status(400).json({ message: "Required fields not provided" });
        }
        // get user and game
        const user = await UserModel.findByPk(user_id)
        const game = await GameModel.findByPk(game_id)
        if (!user || !game) {
            return res.status(404).json({ message: "User or Game not found" });
        }
        const newRating = await PreferencesModel.create({user_id:user_id, game_id:game_id, rating:rating})
        res.status(201).json({message:"Rating added successfully", rating:newRating})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

// update preference
export const updateRating = async (req, res) => {
    try {
        let {rating} = req.body
        let {user_id, game_id} = req.params
        user_id = Number(user_id)
        game_id = Number(game_id)
        if(!user_id || !game_id){
            return res.status(400).json({message:"Ids are required and in number format"})
        }
        if (typeof rating !== 'number') {
            return res.status(400).json({ message: "Invalid data type"})
        }
        // find list
        const user = await UserModel.findByPk(user_id)
        const game = await GameModel.findByPk(game_id)
        if (!user || !game) {
            return res.status(404).json({ message: "User or Game not found" });
        }
        if(!await validateIfExists(user.id, game.id)){
            return res.status(404).json({ message: "User or Game not found in model" });
        }
        // update list
        await PreferencesModel.update({rating}, {
            where: {game_id: game_id, user_id: user_id},
        })
        res.status(200).json({message:"Rating updated successfully"})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

// delete ratings
export const deleteRating = async(req, res) =>{
    try {
        let {game_id, user_id} = req.params
        game_id = Number(game_id)
        user_id = Number(user_id)
        if(!game_id || !user_id) {
            return res.status(400).json({message:"Ids are required and in number format"})
        }
        if(!await validateIfExists(user_id, game_id)){
            return res.status(404).json({ message: "User or Game not found in model" });
        }

        await PreferencesModel.destroy({where:{user_id: user_id, game_id:game_id}})
        res.status(200).json({message:"Rating deleted successfully"})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

// obtain rating of a specific game
export const getRatingOfGame = async (req, res) => {
    try {
        let {game_id, user_id} = req.params
        game_id = Number(game_id)
        user_id = Number(user_id)
        if(!game_id || !user_id) {
            return res.status(400).json({message:"Ids are required and in number format"})
        }
        if(!await validateIfExists(user_id, game_id)){
            return res.status(404).json({ message: "User or Game not found in model" });
        }
        const rating = await PreferencesModel.findOne({attributes: ['rating'], where:{user_id: user_id, game_id:game_id}})
        res.status(200).json({message:"Rating obatined successfully", rating: rating})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
}

//----------------------------------------------------------------------
// Modular functions
//----------------------------------------------------------------------

const validateIfExists = async (user_id, game_id) =>{
    const preference = await PreferencesModel.findOne({where: {user_id: user_id, game_id:game_id}})
    return !!preference
}