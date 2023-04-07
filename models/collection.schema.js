import mongoose from "mongoose";

const collectionSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plesae provide a category name"],
      trim: true,
      maxLength: [
        120,
        "collection name should not be more than 120 characters",
      ]
    },
  },
  {
    timestamps: true
  }
);

export default mongoose.model("collection", collectionSchema);