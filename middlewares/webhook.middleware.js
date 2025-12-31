const crypto = require("crypto");

const verifyRazorpayWebhook = (req, res, next) => {
  try {
    const razorpaySignature = req.headers["x-razorpay-signature"];
    const payload = req.body;

    const secret = process.env.RAZORPAY_WEBHOOK_SECRET;

    const expectedSignature = crypto
      .createHmac("sha256", secret)
      .update(payload)
      .digest("hex");

    if (razorpaySignature !== expectedSignature) {
     return res.status(400).json({
        message: "Invalid webhook signature",
      });
    } else {
      next();
    }
  } catch (err) {
    next(err);
  }
};

module.exports = verifyRazorpayWebhook;
