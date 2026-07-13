const nodemailer = require("nodemailer");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL,
    pass: process.env.PASS
  }
});

transporter.verify((error) => {
  if (error) {
    console.log("❌ Email service error:", error.message);
  } else {
    console.log("✅ Email service ready");
  }
});

const sendOTPEmail = async (to, otp) => {
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: Arial, sans-serif; background: #f5f5f5; }
        .container { max-width: 500px; margin: 50px auto; background: white; padding: 30px; border-radius: 10px; }
        .otp { font-size: 32px; font-weight: bold; color: #16a34a; padding: 20px; background: #f0fdf4; text-align: center; border-radius: 8px; }
        .footer { margin-top: 20px; text-align: center; color: #666; }
      </style>
    </head>
    <body>
      <div class="container">
        <h2>🔐 OTP Verification</h2>
        <p>Your verification code is:</p>
        <div class="otp">${otp}</div>
        <p>This code is valid for <strong>5 minutes</strong>.</p>
        <p>Never share this code with anyone.</p>
        <div class="footer">© 2026 Ajay Security System</div>
      </div>
    </body>
    </html>
  `;

  return await transporter.sendMail({
    from: process.env.EMAIL,
    to: to,
    subject: "Your OTP Verification Code",
    html: html
  });
};

module.exports = { sendOTPEmail };