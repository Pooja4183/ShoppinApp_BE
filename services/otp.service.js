const Otp = require("../models/OtpModel");
const randomString = require("randomstring");
const sendEmail = require("../utils/sendEmails");

// Generate OTP
function generateOTP() {
  return randomString.generate({
    length: 6,
    charset: "numeric",
  });
}

exports.sendOtp = async (email) => {
  try {
    console.log("user email:", email);

    const otpCode = generateOTP();
    const expiresAt = new Date(Date.now() + 5 * 60 * 1000); // 5 minutes

    // Replace old OTP instead of deleting + creating
    const record = await Otp.create({
      email: email.toLowerCase(),
      otp: otpCode,
      expiresAt: expiresAt,
    });

    console.log("OTP saved in DB:", record);

    // Send email after saving
    await sendEmail(
      email,
      "Verification Email",
      `<h1>Please confirm your OTP</h1>
       <p>Here is your OTP code: <b>${otpCode}</b>. It will expire in 5 minutes.</p>`
    );

    console.log("OTP email sent successfully to:", email);

    return { success: true };
  } catch (err) {
    console.error("Error in sendOtp:", err);
    return { success: false, message: err.message };
  }
};
