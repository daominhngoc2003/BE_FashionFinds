import mongoose from "mongoose";

const categorySchema = new mongoose.Schema(
    {
        category_name: {
            type: String,
        },
        category_image:{
            type: String,
        }
    },
    { timestamps: true, versionKey: false }
);

export default mongoose.model("Category", categorySchema);
