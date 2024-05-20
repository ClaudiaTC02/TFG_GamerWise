import express from "express";
import { verifyToken } from "../utils/auth.js";
import {
  loginWithSteam,
  callbackSteam,
  linkWithSteam,
} from "../services/steamService.cjs";
const router = express.Router();

router.get("/", loginWithSteam);
router.get(
  "/link/:token",
  (req, res, next) => {
    const token = req.params;
    if (!token) {
      return res.status(400).send("Token no proporcionado");
    }
    console.log(token);
    res.cookie("steamToken", token, { maxAge: 900000, httpOnly: true });
    next();
  },
  linkWithSteam
);
router.get("/callback", loginWithSteam, callbackSteam);
router.get("/linkcallback", linkWithSteam, callbackSteam);

export default (app) => {
  app.use("/steam", router);
};
