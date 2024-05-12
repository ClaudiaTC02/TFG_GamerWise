import express from "express";
import { verifyToken } from '../utils/auth.js'
import { createList, getAllList,updateList,deleteList, getList, getListByName  } from "../controllers/ListController.js"
const router = express.Router();

router.post('/', verifyToken, createList)
router.get('/user',verifyToken, getAllList)
router.put('/:id',verifyToken, updateList)
router.delete('/:id',verifyToken, deleteList)
router.get('/:id', verifyToken, getList)
router.get('/name/:name', verifyToken, getListByName)

export default (app) => {app.use("/list", router)}