import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plesae provide a product  name"],
      trim: true,
      maxLength: [
        120,
        "product name should not be more than 120 characters",
      ]
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model("product", productSchema);