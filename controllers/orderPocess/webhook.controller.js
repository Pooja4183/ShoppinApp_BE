const {
  markPaymentSuccess,
  markPaymentFailed,
  getPaymentByRazorpayOrderId,
} = require("../../services/payment/payment.service");
const { markOrderPaid } = require("../../services/order.service");

exports.handleRazorpayWebhook = async (req, res) => {
  const event = req.body.event;

  const razorpayOrderId = req.body?.payload?.payment?.entity?.order_id;

  if (!razorpayOrderId) {
    console.warn("Webhook payload missing order_id");
    return res.status(200).json({
      message: "Ignored webhook event",
    });
  }

  console.log("webhook controller:", razorpayOrderId);

  const payment = await getPaymentByRazorpayOrderId(razorpayOrderId);

  if (!payment) {
    console.warn("Payment is not found for:", payment);

    return res.status(200).json({
      message: "Payment not found",
    });
  }

  if (event === "payment.captured") {
    await markPaymentSuccess(razorpayOrderId);
    await markOrderPaid(payment.orderId);
  } else if (event == "payment.failed") {
    await markPaymentFailed(razorpayOrderId);
  }

  return res.status(200).json({
    message: "Webhook processed",
  });
};
