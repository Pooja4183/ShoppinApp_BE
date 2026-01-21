const mongoose = require("mongoose");

const colorSchema = new mongoose.Schema(
 {
  colorName: { type: String, required: true, unique: true },
  slug: { type: String, required: true, unique: true },
}, { timestamps: true }
);

module.exports = mongoose.model("Color", colorSchema);
