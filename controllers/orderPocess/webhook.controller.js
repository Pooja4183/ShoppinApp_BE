const {markPaymentSuccess, markPaymentFailed} = require('../../services/payment/payment.service')

exports.handleRazorpayWebhook = async (req, res) => {
  const  event  = req.body.event;
  const  razorpayOrderId  = req.body.payload.payment.entity.order_id;

  if (event === "payment.captured") {
 await markPaymentSuccess(razorpayOrderId)
  } else if (event == "payment.failed") {
 await markPaymentFailed(razorpayOrderId)
  }

  res.status(200).json({
    message: "Webhook processed",
  });
};
