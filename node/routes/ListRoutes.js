import express from "express";
import { verifyToken } from '../utils/auth.js'
import { createList, getAllList,updateList,deleteList, getList  } from "../controllers/ListController.js"
const router = express.Router();

router.post('/', verifyToken, createList)
router.get('/user',verifyToken, getAllList)
router.put('/:id',verifyToken, updateList)
router.delete('/:id',verifyToken, deleteList)
router.get('/:name', verifyToken, getList)

export default (app) => {app.use("/list", router)}