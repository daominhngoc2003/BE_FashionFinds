import express from "express";
import {
  addToCart,
  deleteProductCart,
  getCartByUser,
  updateCart,
  getAllCarts,
  deleleAllProductCart,
  checkOut,
} from "../controller/Cart";

const router = express.Router();
router.get("/cart", getAllCarts);
router.get("/cart/user/:userId", getCartByUser);
router.post("/cart", addToCart);
router.post("/cart", deleleAllProductCart);
router.put("/cart/:id", updateCart);
router.delete("/cart", deleteProductCart);
router.post("/cart/checkout", checkOut);

export default router;
