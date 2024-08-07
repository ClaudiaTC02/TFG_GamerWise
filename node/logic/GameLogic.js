import GameModel from "../models/GameModel.js";

//----------------------------------------------------------------------
// CRUD Methods
//----------------------------------------------------------------------

// create a new Game
export async function createGameLogic(name, company, platforms, max_players, gender, igdb_id, cover, release_date) {
    console.log(name, company, platforms, max_players, gender, igdb_id, release_date)
    try {
        // Validar campos requeridos
        if (!validateRequiredFields({ name, company, platforms, max_players, gender, igdb_id, release_date})) {
            throw new Error("Required fields are not provided");
        }
        // Validar tipos de datos
        if (!validateDataTypes({ name, company, platforms, max_players, gender, igdb_id, release_date })) {
            throw new Error("Invalid data type");
        }
        // Crear nuevo juego
        const newGame = await GameModel.create({ name, company, platforms, max_players, cover, release_date, gender, igdb_id });
        return { success: true, newGame };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// get Game
export async function getGameLogic(igdb_id) {
    try {
        // Validar campos requeridos
        if (!igdb_id) {
            throw new Error("Required fields are not provided");
        }
        // Validar tipos de datos
        if (typeof igdb_id !== "number") {
            throw new Error("Invalid data type");
        }
        // Get game
        const game = await GameModel.findAll({ where: { igdb_id: igdb_id } });
        if(game.length <= 0){
            throw new Error("Game not found");
        }
        return { success: true, game };
    } catch (error) {
        return { success: false, error: error.message };
    }
}

// get all games
export async function getAllGamesLogic() {
    try {
        // Get games
        const games = await GameModel.findAll();
        if(games.length <= 0){
            throw new Error("No games found");
        }
        return { success: true, games };
    } catch (error) {
        return { success: false, error: error.message };
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
        gender: "string",
        igdb_id: "number",
        release_date: "number"
    };
    for (let key in fields) {
        if (!dataTypes[key] || (typeof fields[key] !== dataTypes[key] && !dataTypes[key].includes(typeof fields[key]))) {
            return false;
        }
    }
    return true;
};

const validateRequiredFields = (fields) => {
    const requiredFields = ["name", "company", "platforms", "max_players", "gender", "igdb_id", "release_date"];
    for (let field of requiredFields) {
        if (!fields[field]) {
            return false;
        }
    }
    return true;
};
