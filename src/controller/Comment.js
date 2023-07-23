import Comment from "../model/Comment";
import Product from "../model/Product";
import User from "../model/User";
import { commentSchema } from "../schemas/Comment";

export const postReviewComment = async (req, res) => {
  const { userId, rating, review, productId } = req.body;
  try {
    const { error } = commentSchema.validate(req.body, { abortEarly: false });
    if (error) {
      const errors = error.details.map((error) => error.message);
      console.log(errors);
      return res.status(400).json({
        message: errors,
      });
    }
    if (!userId) {
      return res.status(401).json({
        message: "Bạn phải đang nhập mới được đánh giá sản phẩm!",
      });
    }
    const user = await User.findById(userId);
    const user_name = user.user_lastname;
    const existingComment = await Comment.findOne({ userId, productId });
    if (existingComment) {
      return res.status(401).json({
        message: "Bạn đã đánh giá sản phẩm này trước rồi!",
      });
    }
    await Comment.create({
      user_name,
      userId,
      rating,
      review,
      productId,
    });
    const comments = await Comment.find({ productId });
    const totalRating = comments.reduce(
      (totalRating, rating) => totalRating + rating.rating,
      0
    );
    const reviewCount = comments.length;
    const averageScore = totalRating / reviewCount;
    const product = await Product.findById(productId);
    product.average_score = Math.round(averageScore);
    product.review_count = reviewCount;
    await product.save();
    if (user) {
      return res.status(200).json({
        message: "Bạn đã đánh giá thành công sản phẩm này!",
        success: true,
      });
    }
  } catch (error) {
    return res.status(400).json({
      message: error.message,
    });
  }
};

export const deleteComment = async (req, res, next) => {
  const id = req.params.id;
  try {
    const deleted = await Comment.deleteOne({ _id: id });
    if (deleted)
      return res
        .status(200)
        .json({ success: true, message: "Đã xóa thành công đánh giá này!" });
  } catch (error) {
    return res.status(500).json({ success: false, message: error.message });
  }
};
