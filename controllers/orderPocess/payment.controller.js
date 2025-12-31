const { initiatePayment } = require("../../services/payment/payment.service");

exports.createPayment = async (req, res) => {
  try {
    const { amount, orderId } = req.body;
    const initiatedPayment = await initiatePayment({ amount, orderId });

    res.status(200).json({
      message: "Payment created successfully",
      data: initiatedPayment,
    });
  } catch (err) {
    res.status(500).json({
      message: "Error creating Payment",
      error: err.message,
    });
  }
};
