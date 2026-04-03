const Order = require("../models/order.model");
const Product = require("../models/product.model");

exports.createOrder = async ({ userId, addressId, items }) => {
  if (!items || items.length === 0) {
    throw new Error("No itmes provided");
  }

  let totalAmount = 0;

  // Buil order itmes snapshot

  const orderItems = await Promise.all(
    items.map(async (item) => {
      const { productId, quantity, size, color } = item;
      if (!productId || !quantity) {
        throw new Error("Inavlid item data");
      }
      // fetch product from DB

      const product = await Product.findById(productId);
      if (!product) {
        throw new Error("Product not found");
      }

      // Extract snapshot  fields

      const title = product.title;
      const price = product.price;
      const image = product.images?.[0]?.url || "";

      // calculate total

      totalAmount += price * quantity;

      return {
        productId: product._id,
        title,
        image,
        price,
        quantity,
        size,
        color,
      };
    }),
  );

  const newOrder = await Order.create({
    status: "PENDING",
    userId,
    addressId,
    items:orderItems,
    totalAmount,
  });

  return newOrder;
};

exports.markOrderPaid = async (orderId) => {
  await Order.updateOne(
    { _id: orderId },
    { status: "CONFIRMED", confirmedAt: new Date() },
  );
  console.log("Confirming order");
};

exports.markOrderCancel = async (orderId) => {
  await Order.updateOne(
    { _id: orderId },
    { status: "CANCELLED", confirmedAt: new Date() },
  );
  console.log("Order is canceled");
};

exports.fetchUserOrders = async ({ userId }) => {
  const getOrder = await Order.find({ userId: userId });
  console.log("get orders:", getOrder);

  return getOrder;
};

exports.fetchOrderDetail = async ({ orderId }) => {
  const getOrderDetail = await Order.findById(orderId);
  console.log("get order detail", getOrderDetail);
  return getOrderDetail;
};
