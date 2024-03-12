//connection db
//import db from '../database/db.js'
import db from '../database/db_test.js'
import DataType from 'sequelize'

const GameModel = db.define('game', {
    //Atributes
    name:{
        type: DataType.STRING,
        allowNull: false
    },
    company:{
        type: DataType.STRING,
        allowNull: false
    },
    platforms:{
        type: DataType.STRING,
        allowNull: false
    },
    max_players:{
        type: DataType.INTEGER,
        allowNull: false
    },
    gender:{
        type: DataType.STRING,
        allowNull: false
    }
},{
    //Other model options
    freezeTableName: true, // stip the auto-pluralization 
    timestamps: false  
})
export default GameModel