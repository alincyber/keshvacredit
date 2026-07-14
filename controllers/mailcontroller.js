const generateOTP = require("../util/generateOTP");
const otpStore = require("../data/otpstore");
const transporter = require("../config/mailer");
const logger = require("../config/logger");

const sendOTP = async (req, res) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: "Email is required",
      });
    }

    if (!email.includes("@") || !email.includes(".")) {
      return res.status(400).json({
        success: false,
        message: "Please enter a valid email address",
      });
    }

    const otp = generateOTP();
    const otpKey = `email:${email}`;

    otpStore[otpKey] = {
      otp,
      expiresAt: Date.now() + 5 * 60 * 1000,
    };

    const mailOptions = {
      from: process.env.EMAIL_USER,
      to: email,
      subject: "Your KeshvaCredit OTP Code",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 480px; margin: 0 auto; padding: 32px 24px; border: 2px solid #222; border-radius: 12px;">
          <h1 style="color: #222; font-size: 24px; margin-bottom: 8px;">KeshvaCredit</h1>
          <p style="color: #555; font-size: 14px; margin-bottom: 24px;">Use the OTP below to verify your email address.</p>
          <div style="background: #f4f4f4; border: 2px solid #222; border-radius: 8px; padding: 20px; text-align: center; font-size: 36px; letter-spacing: 8px; font-weight: bold; color: #222;">
            ${otp}
          </div>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">This OTP is valid for 5 minutes. Do not share it with anyone.</p>
        </div>
      `,
    };

    await transporter.sendMail(mailOptions);

    logger.info({ email: "[REDACTED]" }, "Email OTP sent");

    return res.json({
      success: true,
      message: "OTP sent to your email",
    });
  } catch (error) {
    logger.error({ err: error }, "Failed to send email OTP");
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP. Please try again later.",
    });
  }
};

const verifyOTP = (req, res) => {
  const { email, otp } = req.body;

  if (!email || !otp) {
    return res.status(400).json({
      success: false,
      message: "Email and OTP are required",
    });
  }

  const otpKey = `email:${email}`;
  const data = otpStore[otpKey];

  if (!data) {
    return res.status(400).json({
      success: false,
      message: "OTP not found. Please request a new one.",
    });
  }

  if (Date.now() > data.expiresAt) {
    delete otpStore[otpKey];
    return res.status(400).json({
      success: false,
      message: "OTP has expired. Please request a new one.",
    });
  }

  if (data.otp !== otp) {
    return res.status(400).json({
      success: false,
      message: "Invalid OTP. Please try again.",
    });
  }

  delete otpStore[otpKey];

  return res.json({
    success: true,
    message: "Email verified successfully",
  });
};

module.exports = { sendOTP, verifyOTP };
