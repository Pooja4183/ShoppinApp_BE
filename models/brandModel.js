const mongoose = require("mongoose");

const brandSchema = new mongoose.Schema(
 {
  brandName: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true }
);

module.exports = mongoose.model("Brand", brandSchema);
