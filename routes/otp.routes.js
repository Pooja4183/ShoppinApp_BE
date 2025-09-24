// otp.routes.js
const express = require("express");
const router = express.Router();
const otpController = require("../controllers/otp.controller");

// Public Routes
router.post("/verify-otp", otpController.verifyOTP);

module.exports = router;
