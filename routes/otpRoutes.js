const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/otpController.js");

const router = express.Router();
const verifytoken = require("../middleware/auth.js")

// const otpController = require("../controllers/mailcontroller.js");
// router.post("/email-otp", otpController.sendOTP);
router.post("/send-otp",sendOTP);
router.post("/verify-otp",verifyOTP);

module.exports = router;