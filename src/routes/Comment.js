import express from "express";
import {
  deleteComment,
  getAllComments,
  getCommentByProduct,
  postReviewComment,
} from "../controller/Comment";
const router = express.Router();
router.get("/comments", getAllComments);
router.post("/comments", postReviewComment);
router.delete("/comments/:id", deleteComment);
router.get("/comments/:id", getCommentByProduct);
export default router;
