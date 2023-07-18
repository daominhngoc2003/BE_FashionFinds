import express from "express";

import {
  create,
  getCategoryBySlug,
  deleteCategory,
  getAllcategory,
  updateCategory,
  getCategoryProducts,
  getCategoryById
} from "../controller/Category";

const router = express.Router();
router.get("/categories", getAllcategory);
router.get("/categories/:id", getCategoryById);
router.get("/category/:slug", getCategoryBySlug);
router.post("/categories", create);
router.delete("/categories/:id", deleteCategory);
router.put("/categories/:id", updateCategory);
router.get("/categories/:id/products", getCategoryProducts);
export default router;
