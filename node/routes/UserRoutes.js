import express from "express";
import { createUser, login, getBasicInfo, updateUser, deleteUser } from "../controllers/UserController.js"
import { verifyToken } from '../utils/auth.js'
const router = express.Router();

router.post('/login', login)
router.post('/', createUser)
router.get('/', verifyToken,getBasicInfo)
router.put('/', verifyToken, updateUser)
router.delete('/', verifyToken, deleteUser)

export default (app) => {app.use("/user", router)}