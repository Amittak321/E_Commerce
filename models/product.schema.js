import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Plesae provide a product  name"],
      trim: true,
      maxLength: [120, "product name should not be more than 120 characters"]
    },
    price: {
      type: Number,
      required: [true, "Plesae provide a product  price"],
      maxLength: [5, "product price should not be more than 5"]
    },
    description: {
      type: String,
      //use some form of editor //assignment
    },
    photos: [
      {
        secure_url: {
          type: String,
          required: true
        }
      }
    ],
    stock: {
      type: Number,
      default: 0
    },
    sold: {
      type: Number,
      default: 0
    },
    collectionId: {
      type: mongoose.Schema.Types.ObjectId, // to get id of collection
      ref: "Collection", // Always use you given name only which you have given at the time of creating schema (Collection not Collections)
    }
  },
  {
    timestamps: true
  }
);

export default mongoose.model("Product", productSchema);
