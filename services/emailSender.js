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
  const recipients = Array.isArray(to)
    ? to.filter(Boolean).map((value) => value.trim())
    : [typeof to === "string" ? to.trim() : ""];

  try {
    const normalizedRecipients = recipients.filter(Boolean);
    if (!normalizedRecipients.length) {
      throw new Error("No recipient email provided");
    }

    const mailOptions = {
      from: `"KeshvaCredit" <${process.env.EMAIL_USER?.trim() || "noreply@keshvacredit.com"}>`,
      to: normalizedRecipients,
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

    logger.info({ to: normalizedRecipients, subject }, "Attempting to send application email");
    const info = await transporter.sendMail(mailOptions);

    logger.info(
      { messageId: info.messageId, response: info.response, to: normalizedRecipients },
      "Application email sent",
    );
    return info;
  } catch (err) {
    logger.error(
      {
        err: {
          message: err.message,
          code: err.code,
          response: err.response,
          stack: err.stack,
        },
        to: normalizedRecipients,
      },
      "Failed to send application email",
    );
    throw err;
  }
}

module.exports = { sendApplicationEmail };
