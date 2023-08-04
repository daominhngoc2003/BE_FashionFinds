import express from "express";
import {
  addToCart,
  updateCart,
  getAllCarts,
  getCartByUser,
  deleteCartItem,

} from "../controller/Cart";

const router = express.Router();
router.get("/cart", getAllCarts);
router.get("/cart/:id/getCartByUser", getCartByUser);
router.post("/cart/addToCart", addToCart);
router.put("/cart/:id", updateCart);
router.delete("/cart/:id", deleteCartItem);


export default router;
