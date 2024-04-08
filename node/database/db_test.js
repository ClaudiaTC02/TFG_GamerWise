import {Sequelize} from 'sequelize'

const db = new Sequelize('gamerwise_db_test','root','',{
    host: 'localhost',
    dialect: 'mysql'
})

export default db