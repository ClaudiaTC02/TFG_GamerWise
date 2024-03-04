import GameModel from "./GameModel.js";
import ListGameModel from "./ListGameModel.js";
import ListModel from "./ListModel.js";
import PreferencesModel from "./PreferencesModel.js";
import UserModel from "./UserModel.js";

// relation 1-n User*List
UserModel.hasMany(ListModel,{
    foreignKey: 'user_id'
})
ListModel.belongsTo(UserModel)

// relation 1-n User*Preferences
UserModel.hasMany(PreferencesModel,{
    foreignKey: 'user_id'
})
PreferencesModel.belongsTo(UserModel)

// relation 1-n Game*Preferences
GameModel.hasMany(PreferencesModel, {
    foreignKey: 'game_id'
})
PreferencesModel.belongsTo(GameModel)

// relation n-n List-Game
ListModel.belongsToMany(GameModel, {
    through: {
        model: ListGameModel,
        unique: false,
        foreignKey: 'list_id'
    }
})

// relation n-n Game-List
GameModel.belongsToMany(ListModel, {
    through: {
        model: ListGameModel,
        unique: false,
        foreignKey: 'game_id'
    }
})

export {GameModel, UserModel, ListModel, ListGameModel, PreferencesModel}