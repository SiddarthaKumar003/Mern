import mongoose from "mongoose";

// Creating the product schema
const productSchema = new mongoose.Schema({
    productName: {
        type: String,
        required: true,
      },
      brandName: {
        type: String,
        required: true,
      },
      category: {
        type: String,
        required: true,
      },
      productImage: {
        type: [String],  // Array of image URLs
      },
      price: {
        type: Number,
        required: true,
      },
      sellingPrice: {
        type: Number,
        required: true,
      },
      description: {
        type: String,
      }
},{timeseries:true})

// Creating the product model export
const Product = mongoose.model('Product',productSchema);

export default Product