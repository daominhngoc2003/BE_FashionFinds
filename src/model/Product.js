import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
import slug from "mongoose-slug-generator";
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
      enum: ["xl", "x", "m", "freeSize", "2xl", "29", "30", "31", "32"],
      default: "freeSize",
    },
    product_color: {
      type: String,
      enum: ["xanh", "trang", "den"],
      default: "den",
    },
    product_images: {
      type: Object,
      require: true,
    },
    product_description_sort: {
      type: String,
      minlength: 6,
      maxlength: 255,
    },
    product_description_long: {
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
    // product_status: {
    //   type: Boolean,
    // },
    categoryId: {
      type: mongoose.Types.ObjectId,
      ref: "Category",
      require: true,
    },
    slug: {
      type: String,
      slug: "product_name",
    },
  },
  { timestamps: true, versionKey: false }
);
mongoose.plugin(slug);
ProductSchema.plugin(mongoosePaginate);

export default mongoose.model("Product", ProductSchema);
