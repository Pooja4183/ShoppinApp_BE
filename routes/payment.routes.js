const express = require('express');
const router = express.Router();
const {createPayment} = require('../controllers/orderPocess/payment.controller');

router.post("/create-razorpay-order", createPayment);
// router.post("/verify",verifyPayment);

module.exports = router
