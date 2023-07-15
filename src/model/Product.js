import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const ProductSchema = new mongoose.Schema(
  {
    product_name: {
      type: String,
      require: true,
      minlength: 3,
      maxlength: 50,
    },
    product_price: {
      type: Number,
      min: 0,
    },
    product_discount: {
      type: Number,
      min: 0,
    },
    product_size: {
      type: String,
    },
    product_color: {
      type: String,
    },
    product_images: {
      type: Object,
      require: true,
    },
    product_deScription_sort: {
      type: String,
      minlength: 6,
      maxlength: 255,
    },
    product_deScription_long: {
      type: String,
      minlength: 6,
      maxlength: 255,
    },
    product_quantity: {
      type: Number,
      min: 0,
      minlength: 0,
      maxlength: 1000,
    },
    product_status: {
      type: Boolean,
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
