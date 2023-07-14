import express from "express";
import { createProduct, deleteProduct, getOne, getall, updateProduct } from "../controller/Product";
 const Router = express.Router();
 Router.get("/products",getall)
 Router.get("/products/:id",getOne)
 Router.delete("/products/:id",deleteProduct)
 Router.put("/products/:id",updateProduct)
 Router.post("/products",createProduct)
 export default Router

