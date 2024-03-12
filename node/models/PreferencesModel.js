//connection db
//import db from '../database/db.js'
import db from '../database/db_test.js'
import DataType from 'sequelize'

const PreferencesModel = db.define('preferences', {
    //Atributes
    rating:{
        type: DataType.INTEGER,
        allowNull: false
    }
},{
    //Other model options
    freezeTableName: true, // stip the auto-pluralization 
    timestamps: false  
})
PreferencesModel.removeAttribute('id')
export default PreferencesModel