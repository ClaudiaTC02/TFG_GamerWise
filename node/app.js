/**
 *
 * NOMBRE: app.js
 * AUTORA: Claudia Torres Cruz
 * FECHA: 28/02/2024
 * DESCRIPCIÓN: En este fichero se encuentra la lógica verdadera encargada de recoger datos de la base de datos
 *
 */
import express from 'express';
import cors from 'cors'
// conection db
import db from './database/db_test.js'
import { UserModel, ListModel, GameModel, PreferencesModel, ListGameModel } from './models/index.js';
// import router
import userRoutes from './routes/UserRoutes.js'

const app = express()

app.use(cors())
app.use(express.json())
app.use('/user', userRoutes) // userRoutes will execute in /user

try {
    await db.authenticate()
    console.log('Conexion exitoa a la base de datos')
} catch (error) {
    console.log(`El error de conexion es: ${error}`)
}

app.listen(8000, ()=>{
    console.log('Server UP running in http://localhost:8000/')
})