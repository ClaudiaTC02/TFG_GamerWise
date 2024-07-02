//connection db
import db from '../database/db.js'
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
    cover:{
        type: DataType.STRING
    },
    release_date:{
        type: DataType.INTEGER,
        allowNull: false
    },
    gender:{
        type: DataType.STRING,
        allowNull: false
    },
    igdb_id: {
        type: DataType.INTEGER,
        allowNull: false,
        unique: true
    }
},{
    //Other model options
    freezeTableName: true, // stip the auto-pluralization 
    timestamps: false  
})
export default GameModel