const {createOrder} = require("../../services/order.service");

exports.placeOrder = async (req, res, next) => {
  try {
    const { addressId, items, totalAmount } = req.body;
    const userId = req.user.id;

   const createdOrder =  await createOrder({ userId, addressId, items, totalAmount });

    res.status(200).json({
      message: "Order created successfully",
      data:createdOrder,
    });
    console.log("Stage: order created")

  } catch (err) {
    res.status(500).json({
      message: "Error creating order",
      error: err.message,
    });
  }
};

exports.getOrder = async (req,res,next)=>{
  
}

