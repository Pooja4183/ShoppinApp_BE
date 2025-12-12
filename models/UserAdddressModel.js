const mongoose = require("mongoose");

const userAddressSchema = new mongoose.Schema(
  {
    name: { type: String },
    address: {
    type: String,
    },
    mobile: { type: Number },
    pin_Code: { type: Number },
    town_city: { type: String },
    country: { type: String },
    state: { type: String },
    landmark: { type: String },
    // Reference to User Id
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      index:true, // simple way to add an index
    },
    
  },

  { timestamps: true }
);

// Compound index for frequent queries (optional)
userAddressSchema.index({ userId: 1, createdAt: -1 });

module.exports = mongoose.model("Address", userAddressSchema);
