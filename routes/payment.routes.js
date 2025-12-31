const express = require('express');
const router = express.Router();
const {createPayment} = require('../controllers/orderPocess/payment.controller');
const verifyRazorpyWebhook = require("../middlewares/webhook.middleware");

router.post("/",verifyRazorpyWebhook, createPayment);

module.exports = router
