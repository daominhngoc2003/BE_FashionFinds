import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductByCategory,
  getProductById,
  getall,
  updateProduct,
} from "../controller/Product";
import { authenticate } from "../middleware/Authenticate";
import { authorization } from "../middleware/Authorization";
const Router = express.Router();
Router.get("/products", getall);
Router.get("/products/:id", getProductById);
Router.delete("/products/:id", deleteProduct);
Router.put("/products/:id", updateProduct);
Router.post("/products", createProduct);
// Router.delete("/products/:id", authenticate, authorization, deleteProduct);
// Router.put("/products/:id", authenticate, authorization, updateProduct);
// Router.post("/products", authenticate, authorization, createProduct);
Router.get("/products/categoryId/:id", getProductByCategory);
export default Router;
