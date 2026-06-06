const generateOTP = require("../util/generateOTP.js");
const otpStore = require("../data/otpstore.js");
const logger = require("../config/logger");
const sendOTP = (req, res) => {
const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({
      success: false,
      message: "Phone number required",
    });
  }

  if (phone.length !== 10) {
    return res.status(400).json({
      success: false,
      message: "Phone number must be 10 digits",
    });
  }

  if (isNaN(phone)) {
    return res.status(400).json({
      success: false,
      message: "Phone number must contain only numbers",
    });
  }

  const otp = generateOTP();

  otpStore[phone] = {
    otp,
    expiresAt: Date.now() + 5 * 60 * 1000,
  };

  logger.info({ phone: "[REDACTED]" }, "OTP generated");

  res.json({
    success: true,
    message: "OTP sent successfully",
    otp, 
  });
};
const verifyOTP = (req, res) => {
  const { phone, otp } = req.body;

  const data = otpStore[phone];

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "OTP not found",
    });
  }

  if (Date.now() > data.expiresAt) {
    delete otpStore[phone];

    return res.status(400).json({
      success: false,
      message: "OTP expired",
    });
  }

  if (data.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP",
    });
  }

  delete otpStore[phone];

  return res.json({
    success: true,
    message: "OTP verified successfully",
  });
};
module.exports = {
  sendOTP,
  verifyOTP,
};