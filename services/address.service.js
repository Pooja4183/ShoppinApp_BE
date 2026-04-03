const Address = require("../models/user-adddress.model");

exports.fetchUserAddress = async () => {
  const getAddressList = await Address.find();
  console.log("get address list:", getAddressList);

  return getAddressList;
};

// exports.fetchOrderDetail = async({orderId})=>{
//   const getOrderDetail = await Order.findById(orderId);
//   console.log("get order detail",getOrderDetail);
//   return getOrderDetail;
// };