import GameModel from "./GameModel.js";
import ListGameModel from "./ListGameModel.js";
import ListModel from "./ListModel.js";
import PreferencesModel from "./PreferencesModel.js";
import UserModel from "./UserModel.js";

// relation 1-n User*List
UserModel.hasMany(ListModel,{
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})
ListModel.belongsTo(UserModel,{
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

// relation 1-n User*Preferences
UserModel.hasMany(PreferencesModel,{
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})
PreferencesModel.belongsTo(UserModel, {
    foreignKey: {
        name: 'user_id',
        allowNull: false
    }
})

// relation 1-n Game*Preferences
GameModel.hasMany(PreferencesModel, {
    foreignKey: {
        name: 'game_id',
        allowNull: false
    }
})
PreferencesModel.belongsTo(GameModel,{
    foreignKey: {
        name: 'game_id',
        allowNull: false
    }
})

// relation n-n List*Game
ListModel.belongsToMany(GameModel, { 
    through: { model: ListGameModel, unique: false }, 
    foreignKey: {
        name: 'list_id',
        allowNull: false,
    },
});

// relation n-n Game*List
GameModel.belongsToMany(ListModel, {
    through: { model: ListGameModel, unique: false },
    foreignKey: {
        name: 'game_id',
        allowNull: false,
    },
});

// sync
const syncModels = async ()=>{
    try{
        await UserModel.sync()
        console.log('User sync complete')
        await GameModel.sync()
        console.log('Game sync complete')
        await ListModel.sync()
        console.log('List sync complete')
        await ListGameModel.sync()
        console.log('List_Game sync complete')
        await PreferencesModel.sync()
        console.log('Preferences sync complete')
    } catch(error){
        console.error('Error synchronizing models:', error);
    }
}
syncModels()

export {GameModel, UserModel, ListModel, ListGameModel, PreferencesModel}