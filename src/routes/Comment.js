import express from "express";
import {
  deleteComment,
  getAllComments,
  getCommentByProduct,
  postReviewComment,
  searchComment,
} from "../controller/Comment";
import { authenticate } from "../middleware/Authenticate";
import { authorization } from "../middleware/Authorization";
const router = express.Router();
router.get("/comments", authenticate, searchComment);
router.get("/comments", getAllComments);
router.post("/comments", authenticate, postReviewComment);
router.delete("/comments/:id", authenticate, authorization, deleteComment);
router.get("/comments/:id", getCommentByProduct);
export default router;
