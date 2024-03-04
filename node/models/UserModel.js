//connection db
import db from '../database/db.js'
import DataType from 'sequelize'

const UserModel = db.define('user', {
    //Atributes
    address:{
        type: DataType.STRING,
        allowNull: false
    },
    name:{
        type: DataType.STRING,
        allowNull: false
    },
    password:{
        type: DataType.STRING,
        allowNull: false
    },
    steam_token:{
        type: DataType.INTEGER,
        //allow null TRUE
    }
},{
    //Other model options
    freezeTableName: true, // stip the auto-pluralization 
    timestamps: false  
})
export default UserModel