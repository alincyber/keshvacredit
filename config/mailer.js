const nodemailer = require("nodemailer");
const logger = require("./logger");

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
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
