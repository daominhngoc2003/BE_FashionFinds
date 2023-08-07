import mongoose from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";
const userSchema = new mongoose.Schema(
  {
    user_fullName: {
      type: String,
      require: true,
      min: 1,
      maxlength: 55,
    },
    user_email: {
      type: String,
      require: true,
      unique: true,
    },
    user_avatar: {
      type: String,
      require: true,
      default:
        "https://i.pinimg.com/736x/e0/7a/22/e07a22eafdb803f1f26bf60de2143f7b.jpg",
    },
    user_phone: {
      type: Number,
      require: true,
      min: 0,
    },
    user_address: {
      type: String,
      require: true,
    },
    user_password: {
      type: String,
      require: true,
      minlength: 6,
    },
    user_confirmPassword: {
      type: String,
      require: true,
      minlength: 6,
    },
    user_gender: {
      type: String,
      require: true,
      enum: ["nam", "nu", "khac"],
      default: "khac",
    },
    user_status: {
      type: String,
      enum: ["active", "ban"],
      default: "active",
    },
    user_date_of_birth: {
      type: Date,
    },
    user_role: {
      type: String,
      require: true,
      default: "customer",
    },
    cartId: {
      type: mongoose.Types.ObjectId,
      ref: "Cart",
      require: true,
    },
    bills: [{ billId: { type: mongoose.Schema.Types.ObjectId, ref: "Bill" } }],
  },
  { timestamps: true, versionKey: false }
);
userSchema.plugin(mongoosePaginate);
export default mongoose.model("User", userSchema);
