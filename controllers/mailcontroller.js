const { sendOTPEmail } = require("../middleware/emailservice");

const otpStore = {};

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({ message: "Email is required" });
    }

    const otp = Math.floor(100000 + Math.random() * 900000).toString();

    otpStore[email] = {
      otp,
      expires: Date.now() + 5 * 60 * 1000
    };

    await sendOTPEmail(email, otp);

    res.status(200).json({
      message: "OTP sent successfully",
      otp: otp
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({ message: "Email and OTP are required" });
  }

  const userOTP = otpStore[email];

  if (!userOTP) {
    return res.status(400).json({ message: "No OTP found. Please request a new one" });
  }

  if (Date.now() > userOTP.expires) {
    delete otpStore[email];
    return res.status(410).json({ message: "OTP expired. Please request a new one" });
  }

  if (userOTP.otp === otp) {
    delete otpStore[email];
    return res.status(200).json({ message: "OTP verified successfully" });
  }

  return res.status(400).json({ message: "Invalid OTP" });
};

module.exports = { sendOTP,  };