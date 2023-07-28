import mongoose from "mongoose";

const CartSchema = new mongoose.Schema(
  {
    userId: {
      type: mongoose.Types.ObjectId,
      ref: "User",
    },
    products: [
      {
        productId: {
          type: String,
        },
        price: {
          type: Number,
        },
        quantity: {
          ttype: Number,
        },
      },
    ],
    shippingFee: { type: Number },
    coupon: { type: Number },
    totalPrice: { type: Number },
    totalOrder: { type: Number },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Cart", CartSchema);
