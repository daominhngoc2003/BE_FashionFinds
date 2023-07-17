import express from "express";

import {
  create,
  deleteCategory,
  get,
  getAllcategory,
  updateCategory,
  getCategoryProducts
} from "../controller/Category";

const router = express.Router();
router.get("/categories", getAllcategory);
router.get("/categories/:id", get);
router.post("/categories", create);
router.delete("/categories/:id", deleteCategory);
router.put("/categories/:id", updateCategory);
router.get("/categories/:id/products", getCategoryProducts);
export default router;
