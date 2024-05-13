import express from "express";
import { loginWithSteam, callbackSteam  } from "../services/steamService.cjs";
const router = express.Router();

router.get('/', loginWithSteam)
router.get('/callback', loginWithSteam, callbackSteam)

export default (app) => {app.use("/steam", router)}