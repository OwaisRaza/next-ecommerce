import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    title: { type: String, required: true },
    slug: { type: String, required: true, unique: true },
    currentInStock: { type: Number, required: true, default: 0 },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    numReviews: { type: Number, required: true, default: 0 },
    rating: { type: Number, required: true, default: 0 },
    brand: { type: String, required: true },
    description: { type: String, required: true },
    img: { type: String, required: true },
  },
  {
    timestamps: true,
  }
);

const Product =
  mongoose.models.Product || mongoose.model("Product", productSchema);

export default Product;
