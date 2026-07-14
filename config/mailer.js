const nodemailer = require("nodemailer");
const logger = require("./logger");
require("dotenv").config();

const emailUser = process.env.EMAIL_USER?.trim();
const emailPass = process.env.EMAIL_PASS?.replace(/\s+/g, "");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: emailUser,
    pass: emailPass,
  },
});

transporter.verify((err) => {
  if (err) {
    logger.error({ err }, "Mail transporter verification failed");
  } else {
    logger.info("Mail transporter is ready");
  }
});

module.exports = transporter;
