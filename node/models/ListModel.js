//connection db
//import db from '../database/db.js'
import db from '../database/db_test.js'
import DataType from 'sequelize'

const ListModel = db.define('list', {
    //Atributes
    name:{
        type: DataType.STRING,
        allowNull: false
    },
    description:{
        type: DataType.STRING,
        // allow null true
        defaultValue: 'null'
    }
},{
    //Other model options
    freezeTableName: true, // stip the auto-pluralization 
    timestamps: false  
})
export default ListModel