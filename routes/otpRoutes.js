const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/otpController.js");
const {
  sendOTP: sendEmailOTP,
  verifyOTP: verifyEmailOTP,
} = require("../controllers/mailcontroller.js");

const router = express.Router();

// SMS OTP
router.post("/send-otp", sendOTP);
router.post("/verify-otp", verifyOTP);

// Email OTP
router.post("/email-send-otp", sendEmailOTP);
router.post("/email-verify-otp", verifyEmailOTP);

module.exports = router;
