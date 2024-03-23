import express from "express";
import { createList, getAllList,updateList,deleteList  } from "../controllers/ListController.js"
const router = express.Router();

router.post('/', createList)
router.get('/:user_id', getAllList)
router.put('/:id', updateList)
router.delete('/:id', deleteList)

export default (app) => {app.use("/list", router)}