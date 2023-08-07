import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const commentSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
      required: true,
    },
    user_fullName: {
      type: String,
      // required: true,
    },
    user_avatar: {
      type: String,
      // required: true,
    },
    rating: {
      type: Number,
      min: 0,
      max: 5,
      required: true,
    },
    review: {
      type: String,
      required: true,
    },
    productId: {
      type: mongoose.Types.ObjectId,
      ref: "Product",
      require: true,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  }
);

commentSchema.plugin(mongoosePaginate);
export default mongoose.model("Comment", commentSchema);
