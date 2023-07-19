import express from "express";
import {
  createProduct,
  deleteProduct,
  getProductById,
  getall,
  updateProduct,
} from "../controller/Product";
const Router = express.Router();
Router.get("/products", getall);
Router.get("/products/:id", getProductById);
Router.delete("/products/:id", deleteProduct);
Router.put("/products/:id", updateProduct);
Router.post("/products", createProduct);
export default Router;
