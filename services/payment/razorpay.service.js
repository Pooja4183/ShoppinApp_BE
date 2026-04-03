const razorpay = require("../../config/razorpay.config");

exports.createRazorpayOrder = async(amount,receiptId)=>{
    return await razorpay.orders.create({
        amount: amount*100,
        currency: "INR",
        receipt: receiptId,
    });
};