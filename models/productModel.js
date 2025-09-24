const mongoose = require("mongoose");

const productSchema = new mongoose.Schema(
  {
    title: { type: String },
    description: {
      type: String,
    },
    price: { type: Number },
    // Reference to Category collection
    category: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Category",
      required: true,
    },
    // Reference to Brand collection
    brand: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Brand",
    },
    // Reference to Color collection
    color: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Color",
    },
    images: [
      {
        original: { type: String, required: true },
        saved: { type: String, required: true },
        url: { type: String },
      },
    ],
  },

  { timestamps: true }
);

module.exports = mongoose.model("Product", productSchema);
