const {
  createOrder,
  fetchUserOrders,
  fetchOrderDetail,
  markOrderCancel,

} = require("../../services/order.service");

exports.placeOrder = async (req, res, next) => {
  try {
    const { addressId, items } = req.body;
    const userId = req.user.id;

    const createdOrder = await createOrder({
      userId,
      addressId,
      items
    });

    res.status(200).json({
      message: "Order created successfully",
      data: createdOrder,
    });
    console.log("Stage: order created");
  } catch (err) {
    res.status(500).json({
      message: "Error creating order",
      error: err.message,
    });
  }
};

exports.getMyOrders = async (req, res, next) => {
  const userId = req.user.id;
console.log("user id@@@@@@@@@@@@@", userId)
  if (!userId) {
    return res.status(500).json({
      message: "User is not logged in",
      success: false,
    });
  }
  try {
    const getuserOrders = await fetchUserOrders({ userId });

    res.status(200).json({
      message: "orders feched successfully",
      data: getuserOrders,
    });
  } catch (error) {
    res.status(500).json({
      error: error.message,
      message: "failed to fetch orders",
    });
  }
};

exports.getSingleOrder = async (req, res, next) => {
  const orderId = req.params.orderId;


  try {
    const getOrderById = await fetchOrderDetail({ orderId });
    res.status(200).json({
      message: "Order Detail fetched successfully!",
      data: getOrderById,
    });
  } catch (error) {
    res.status(500).json({
      message: "failed to fetch order detail",
      error: error.message,
    });
  }
};

exports.cancelOrder = async (req, res, next) => {
  const orderId = req.params.orderId;
  console.log("params =>", req.params);
  try {
    if(orderId){
       console.log("cancel order")
    const data = await markOrderCancel(orderId );
    res.status(200).json({
      message:"Order canceled successfully!",
      data:data,
    })

    }else{
      console.log("if condition not working")
    }
   
  } catch (error){
    res.status(500).json({
      message:"Couldn't cancel order",
      error:error.message,
      
    })
  }
};
