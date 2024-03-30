import express from "express";
import { createUser, login, getBasicInfo } from "../controllers/UserController.js"
import { verifyToken } from '../utils/auth.js'
const router = express.Router();

router.post('/login', login)
router.post('/', createUser)
router.get('/:id', verifyToken,getBasicInfo)

export default (app) => {app.use("/user", router)}