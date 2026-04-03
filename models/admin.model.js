const mongoose = require("mongoose");

const adminSchema = new mongoose.Schema(
  { 
    name: { type: String, required: true },
    email: {
      type: String,
      unique: [true, "email alrady exists!"],
      lowercase: true,
      required: true,
    },
    password: { type: String, required: true },
    isVerrified:{ type:Boolean, default:false },

  },
   
  { timestamps: true }
);

module.exports = mongoose.model("Admin", adminSchema);
