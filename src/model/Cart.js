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
          type: mongoose.Types.ObjectId,
          ref: "Product",
        },
        price: {
          type: Number,
        },
        quantity: {
          type: Number,
        },
      },
    ],
    shippingFee: { type: Number },
    counpon: { type: Number },
    totalPrice: { type: Number },
    totalOrder: { type: Number, required: true, min: 0 },
  },
  { timestamps: true, versionKey: false }
);

export default mongoose.model("Cart", CartSchema);
