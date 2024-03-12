//connection db
//import db from '../database/db.js'
import db from '../database/db_test.js'
import DataType from 'sequelize'

const UserModel = db.define('user', {
    //Atributes
    email:{
        type: DataType.STRING,
        allowNull: false,
        unique: true
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