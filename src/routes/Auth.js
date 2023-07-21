import express from "express";
import { login, refreshToken, register } from "../controller/Auth";

const router = express.Router();
router.post("/signup", register);
router.post("/signin", login);
router.post("refresh-token", refreshToken);
export default router;
