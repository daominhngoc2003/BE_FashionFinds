import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const categorySchema = new mongoose.Schema(
  {
    category_name: {
      type: String,
    },
    category_images: {
      type: String,
    },
    products: [
      {
        type: mongoose.Types.ObjectId,
        ref: "Product",
        require: true,
      },
    ],
  },
  { timestamps: true, versionKey: false }
);

categorySchema.plugin(mongoosePaginate);
export default mongoose.model("Category", categorySchema);
