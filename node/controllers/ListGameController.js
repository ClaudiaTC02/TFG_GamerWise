//import Model
import ListGameModel from "../models/ListGameModel.js";
import GameModel from "../models/GameModel.js";
import ListModel from "../models/ListModel.js";

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// add game to list
export const addGameToList = (async (req, res) => {
    try {
        let {list_id, game_id} = req.body
        list_id = Number(list_id)
        game_id = Number(game_id)
        if(!list_id  || !game_id) {
            return res.status(400).json({message:'Required fields not provided'})
        }
        // get the list and game
        const list = await ListModel.findOne({where: {id: list_id}}) // user_id: req.user.user_id
        const game = await GameModel.findByPk(game_id)
        if(!list || !game) {
            return res.status(404).json({message: 'List or Game not found'})
        }

        await list.addGame(game)
        res.status(201).json({message: 'Game added to list successfully'})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
})

// delete game from list
export const deleteGameFromList = (async (req, res) => {
    try {
        let {list_id, game_id} = req.params
        list_id = Number(list_id)
        game_id = Number(game_id)

        if(!list_id  || !game_id) {
            return res.status(400).json({message:'Required fields not provided'})
        }
        // get the list and game
        const list = await ListModel.findOne({where: {id: list_id}}) // user_id: req.user.user_id
        const game = await GameModel.findByPk(game_id)
        if(!list || !game) {
            return res.status(404).json({message: 'List or Game not found'})
        }

        await list.removeGame(game)
        res.status(201).json({message: 'Game deleted to list successfully'})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
})

// obain all games of a list
export const getAllGames = (async (req, res) => {
    try {
        let {list_id} = req.params
        list_id = Number(list_id)

        if(!list_id){
            return res.status(400).json({message:'Required fields not provided'})
        }
        // get list
        const list = await ListModel.findByPk(list_id)
        if(!list){
            return res.status(404).json({message: 'List not found'})
        }
        const games = await ListGameModel.findAll({where:{list_id: list_id}})
        if(games.length === 0){
            return res.status(404).json({message: 'No games found for this list'})
        }

        res.status(200).json({message: 'Games obtained successfully', games: games})
    } catch (error) {
        // Internal server error
        res.status(500).json({ message: error.message });
    }
})