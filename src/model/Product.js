import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      require: true,
    },
    product_price: {
      type: Number,
      min: 0,
    },
    product_images: {
      type: Object,
      require: true,
    },
    product_deScription: {
      type: String,
    },
    product_quantity: {
      type: Number,
    },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      require: true,
    },
  },
  { timestamps: true, versionKey: false }
);

ProductSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", ProductSchema);
