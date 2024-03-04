//connection db
import db from '../database/db.js'
import DataType from 'sequelize'

const ListGameModel = db.define('list_game', {},{
    //Other model options
    freezeTableName: true, // stip the auto-pluralization 
    timestamps: false  
})
ListGameModel.removeAttribute('id')
export default ListGameModel