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
  await payment.updateOne({ razorpayOrderId }, { status: SUCCESS });
};

exports.markPaymentFailed = async (razorpayOrderId) => {
  await payment.updateOne({ razorpayOrderId }, { status: SUCCESS });

};
