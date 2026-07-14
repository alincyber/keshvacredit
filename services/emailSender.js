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
async function sendApplicationEmail({ to, subject, text, pdfBuffer, pdfFilename }) {
  try {
    const info = await transporter.sendMail({
      from: `"KeshvaCredit" <${process.env.EMAIL_USER}>`,
      to,
      subject,
      text,
      attachments: [
        {
          filename: pdfFilename,
          content: pdfBuffer,
        },
      ],
    });

    logger.info({ messageId: info.messageId, to: "[REDACTED]" }, "Application email sent");
    return info;
  } catch (err) {
    logger.error({ err, to: "[REDACTED]" }, "Failed to send application email");
    throw err;
  }
}

module.exports = { sendApplicationEmail };
