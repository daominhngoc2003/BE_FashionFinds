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
      return res.status(400).json({
        message: "Lỗi Validate: " + errors.join(", "),
      });
    }
    if (!userId) {
      return res.status(401).json({
        message: "Bạn phải đang nhập mới được đánh giá sản phẩm!",
      });
    }
    // Check if the product exists
    const product = await Product.findById(productId);

    if (!product) {
      return res.status(404).json({
        message: "Sản phẩm không tồn tại.",
      });
    }
    // Check if the user exists
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({
        message: "Người dùng không tồn tại.",
      });
    }
    // Check if the user already reviewed the product
    const existingComment = await Comment.findOne({ userId, productId });

    if (existingComment) {
      return res.status(401).json({
        message: "Bạn đã đánh giá sản phẩm này trước đó.",
      });
    }
    const user_fullName = user?.user_fullName;
    const user_avatar = user?.user_avatar;
    console.log(user_fullName, user_avatar);
    const comment = await Comment.create({
      user_fullName,
      user_avatar,
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

    // Tính toán số lượng sao và lươtj đánh giá
    const reviewCount = comments.length;
    const averageScore = totalRating / reviewCount;

    product.average_score = Math.round(averageScore);
    product.review_count = reviewCount;
    await product.save();
    if (user) {
      return res.status(200).json({
        message: "Bạn đã đánh giá thành công sản phẩm này!",
        success: true,
        comment,
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: "Lỗi server" + error.message,
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

export const getCommentByProduct = async (req, res) => {
  try {
    const comment = await Comment.find({ productId: req.params.id });
    if (comment.length > 0) {
      return res.status(200).json({
        comment,
        message: "Get comments for product",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
export const getAllComments = async (req, res) => {
  try {
    const comments = await Comment.find();
    if (true) {
      return res.status(200).json({
        comments,
        message: "Get All Comments",
      });
    }
  } catch (error) {
    return res.status(500).json({
      message: error.message,
    });
  }
};
