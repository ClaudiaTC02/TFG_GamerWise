import express from "express";
import { createUser, login, getBasicInfo, updateUser } from "../controllers/UserController.js"
import { verifyToken } from '../utils/auth.js'
const router = express.Router();

router.post('/login', login)
router.post('/', createUser)
router.get('/:id', verifyToken,getBasicInfo)
router.put('/:id', verifyToken, updateUser)

export default (app) => {app.use("/user", router)}