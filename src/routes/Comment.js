import express from "express";
import { deleteComment, postReviewComment } from "../controller/Comment";
const router = express.Router();
router.get("/comments");
router.post("/comments", postReviewComment);
router.delete("/comments/:id", deleteComment);
export default router;
