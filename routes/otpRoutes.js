const express = require("express");
const { sendOTP, verifyOTP } = require("../controllers/otpController.js");

const router = express.Router();
const verifytoken = require("../middleware/auth.js")

router.post("/send-otp",sendOTP);
router.post("/verify-otp",verifyOTP);

module.exports = router;