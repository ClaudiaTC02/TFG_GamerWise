import express from "express";
import { loginWithSteam  } from "../services/steamService.cjs";
const router = express.Router();

router.get('/', loginWithSteam)

export default (app) => {app.use("/steam", router)}