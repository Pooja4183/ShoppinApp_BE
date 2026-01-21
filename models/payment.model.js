const mongoose = require('mongoose');

const paymentSchema = new mongoose.Schema({
    orderId: mongoose.Schema.Types.ObjectId,
    razorpayOrderId:String,
    razorpayPaymentId:String,
    status:{
        type:String,
        enum:['CREATED','SUCCESS','FAILED','REFUNDED'],
        default:"CREATED"
    }

});
module.exports = mongoose.model('Payment',paymentSchema);