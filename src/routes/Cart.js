import express from "express";
import {
  addToCart,
  deleleAllProductCart,
  deleteProductCart,
  getAllCarts,
  getCartById,
  getCartByUser,
  updateCart,
} from "../controller/Cart";
import { authenticate } from "../middleware/Authenticate";
import { authorization } from "../middleware/Authorization";

const router = express.Router();

// add
router.post("/cart/add", authenticate, addToCart);
router.put("/cart/update", authenticate, updateCart);

// get
router.get("/cart", authenticate, authorization, getAllCarts);
router.get("/cart/:id", getCartById);
router.get("/cart/user/:userId", getCartByUser);

// delete
router.post("/cart/delete", deleteProductCart);
router.delete("/cart/deleteall/:userId", authenticate, deleleAllProductCart);
export default router;
