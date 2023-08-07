import mongoose from "mongoose";

const billSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Types.ObjectId, ref: "User" },
    cartId: { type: mongoose.Schema.Types.ObjectId, ref: "Cart" },
    shippingAddress: { type: String },
    shippingFee: { type: Number },
    totalPrice: { type: Number },
    totalOrder: { type: Number },
    paymentMethod: { type: String },
    orderNotes: { type: String, default: "Khách hàng không viết gì" },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product" },
        quantity: { type: Number },
        price: { type: Number },
      },
    ],
    paymentStatus: {
      type: String,
      enum: ["Paid", "Unpaid"],
      default: "Unpaid",
    },
    status: {
      type: String,
      enum: ["Pending", "Confirmed", "Delivering", "Delivered"],
      default: "Pending",
    },
  },
  { timestamps: true, versionKey: false }
);
export default mongoose.model("Bill", billSchema);
