import express from "express";
import { addToCart, updateCart } from "../controller/Cart";

const router = express.Router();
router.post("/cart", addToCart);
router.put("/cart/:id", updateCart);

export default router;
