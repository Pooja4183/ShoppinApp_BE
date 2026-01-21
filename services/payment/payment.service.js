const payment = require("../../models/payment.model");
const razorpayService = require("../payment/razorpay.service");

exports.initiatePayment = async ({ amount, orderId }) => {
  const razorpayOrder = await razorpayService.createRazorpayOrder(
    amount,
    orderId
  );

  const newPayment = await payment.create({
    orderId,
    status: "CREATED",
    razorpayOrderId: razorpayOrder.id,
  });

  return razorpayOrder;
};

exports.markPaymentSuccess = async (razorpayOrderId) => {
  return await payment.updateOne(
    { razorpayOrderId, status: "CREATED" },
    { status: "SUCCESS", paidAt: new Date() }
  );
};

exports.markPaymentFailed = async (razorpayOrderId) => {
  return await payment.updateOne({ razorpayOrderId }, { status: "FAILED" });
};

exports.getPaymentByRazorpayOrderId = async (razorpayOrderId) => {
  return await payment.findOne({ razorpayOrderId });
};
