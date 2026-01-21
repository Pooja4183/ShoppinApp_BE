const Order = require("../models/order.model");

exports.createOrder = async ({ userId, addressId, items, totalAmount }) => {
  const newOrder = await Order.create({
    status: "PENDING",
    userId,
    addressId,
    items,
    totalAmount,
  });

  return newOrder;
};

exports.markOrderPaid = async (orderId ) => {
  await Order.updateOne({ _id: orderId }, { status: "CONFIRMED" ,confirmedAt: new Date()});
  console.log("Confirming order");
};
