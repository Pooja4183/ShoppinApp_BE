const User = require("../models/User");
const Otp = require("../models/OtpModel");

// Verify OTP
exports.verifyOTP = async (req, res) => {
  try {
    const { email, otp } = req.body;
    console.log("verify otp function");

    // Always normalize email to lowercase
    const normalizedEmail = email.toLowerCase();

    // Fetch record only by email
    const record = await Otp.findOne({ email: normalizedEmail });

    if (!record) {
      return res.status(400).json({ message: "No OTP found for this email" });
    }

    // Check OTP match
    if (record.otp !== otp) {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    // Check expiration
    if (record.expiresAt < new Date()) {
      await Otp.deleteOne({ _id: record._id }); // clean expired otp
      return res.status(400).json({ message: "OTP expired" });
    }

    // Mark user as verified
    await User.updateOne({ email: normalizedEmail }, { $set: { isVerified: true } });

    // Delete OTP after successful verification
    await Otp.deleteOne({ _id: record._id });

    res.status(200).json({ message: "OTP verified successfully" });
  } catch (error) {
    res.status(500).json({
      message: "Error verifying OTP",
      error: error.message,
    });
  }
};
