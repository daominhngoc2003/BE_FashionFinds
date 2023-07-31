import express from "express";
import {
  addToCart,
  deleteProductCart,
  getCartByUser,
  updateCart,
  getAllCarts,
} from "../controller/Cart";

const router = express.Router();
router.get("/cart", getAllCarts);
router.get("/cart/:id", getCartByUser);
router.post("/cart", addToCart);
router.put("/cart/:id", updateCart);
router.delete("/cart/:id", deleteProductCart);

export default router;
