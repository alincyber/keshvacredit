const transporter = require("../config/mailer");
const logger = require("../config/logger");

/**
 * Send an email with a PDF attachment to the applicant.
 * @param {object} params
 * @param {string} params.to - Recipient email
 * @param {string} params.subject - Email subject
 * @param {string} params.text - Plain text body
 * @param {Buffer} params.pdfBuffer - PDF document buffer
 * @param {string} params.pdfFilename - Name for the PDF file
 */
async function sendApplicationEmail({
  to,
  subject,
  text,
  pdfBuffer,
  pdfFilename,
}) {
  try {
    const recipient = typeof to === "string" ? to.trim() : "";

    if (!recipient) {
      throw new Error("No recipient email provided");
    }

    const mailOptions = {
      from: `"KeshvaCredit" <${process.env.EMAIL_USER?.trim() || "noreply@keshvacredit.com"}>`,
      to: recipient,
      subject,
      text,
    };

    if (pdfBuffer && pdfFilename) {
      mailOptions.attachments = [
        {
          filename: pdfFilename,
          content: pdfBuffer,
        },
      ];
    }

    const info = await transporter.sendMail(mailOptions);

    logger.info(
      { messageId: info.messageId, to: "[REDACTED]" },
      "Application email sent",
    );
    return info;
  } catch (err) {
    logger.error({ err, to: "[REDACTED]" }, "Failed to send application email");
    throw err;
  }
}

module.exports = { sendApplicationEmail };
