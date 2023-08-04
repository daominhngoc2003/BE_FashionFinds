import express from "express";
import {
  addToCart,
  updateCart,
  getAllCarts,
  getCartByUser,
  deleteCartItem,
} from "../controller/Cart";
import { authenticate } from "../middleware/Authenticate";

const router = express.Router();
router.get("/cart", authenticate, getAllCarts);
router.get("/cart/:id/getCartByUser", authenticate, getCartByUser);
router.post("/cart/addToCart", authenticate, addToCart);
router.put("/cart/:id", authenticate, updateCart);
router.delete("/cart/:id", authenticate, deleteCartItem);

export default router;
