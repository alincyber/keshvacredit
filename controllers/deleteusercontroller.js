const PersonalUser = require("../model/personalmodel");
const FormUser = require("../model/userdata");
const DeletedUser = require("../model/deleteusermodel");
const logger = require("../config/logger");
const { generatePDF } = require("../services/pdfGenerator");
const { sendApplicationEmail } = require("../services/emailSender");

const personalFieldMap = {
  person_name: "Full Name",
  person_email: "Email",
  person_phone: "Phone",
  person_pan: "PAN Number",
  person_dob: "Date of Birth",
  person_aadhar: "Aadhar Number",
  person_name_as_per_aadhar: "Name as per Aadhar",
  employment_type: "Employment Type",
  person_age: "Age",
  loan_purpose: "Loan Purpose (last)",
  annual_income: "Annual Income (₹)",
  person_location: "Location",
  personal_loan_amount: "Last Loan Amount (₹)",
  deleteReason: "Deletion Reason",
  deleteAt: "Scheduled Deletion",
};

const formFieldMap = {
  name: "Full Name",
  email: "Email",
  phone: "Phone",
  pan: "PAN Number",
  dob: "Date of Birth",
  age: "Age",
  income: "Annual Income (₹)",
  loan_amount: "Loan Amount (₹)",
  employment_type: "Employment Type",
  city: "City",
  state: "State",
  pincode: "Pincode",
  deleteReason: "Deletion Reason",
  deleteAt: "Scheduled Deletion",
};

/**
 * Resolve a user record from either collection.
 * Returns { source: 'personal'|'form', doc } or null.
 */
async function resolveUser(phone, email) {
  // Try Personal collection (detailed loan applicants)
  let user = await PersonalUser.findOne({ person_phone: phone, person_email: email });
  if (user) return { source: "personal", doc: user };

  // Fallback to Form users collection (main registration)
  user = await FormUser.findOne({ phone, email });
  if (user) return { source: "form", doc: user };

  return null;
}

// Delete User - Request deletion (48 hours delay)
const deleteUser = async (req, res) => {
    try {
        const { phone, email, reason } = req.body;

        if (!phone || !email) {
            return res.status(400).json({
                success: false,
                message: "Phone and email are required."
            });
        }

        const resolved = await resolveUser(phone, email);
        if (!resolved) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const { source, doc: user } = resolved;

        // Check if already requested
        if (user.deleteRequested === true) {
            return res.status(400).json({
                success: false,
                message: "Deletion request already submitted."
            });
        }

        // Mark for deletion with timestamp
        user.deleteRequested = true;
        user.deleteReason = reason || "User requested account deletion";
        user.deleteRequestedAt = new Date();
        user.deleteAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

        // Personal model has accountStatus; Form model might not — set it if field exists
        if (user.accountStatus !== undefined) {
          user.accountStatus = "pending_deletion";
        }

        await user.save();

        // ── Send PDF email with user data (fire-and-forget) ──
        (async () => {
          try {
            const userObj = user.toObject();
            userObj.deleteReason = user.deleteReason;
            userObj.deleteAt = user.deleteAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" });

            const fieldMap = source === "personal" ? personalFieldMap : formFieldMap;
            const pdfBuf = await generatePDF("Account Deletion", userObj, fieldMap);

            const recipientName = source === "personal" ? user.person_name : user.name;
            const recipientEmail = source === "personal" ? user.person_email : user.email;

            await sendApplicationEmail({
              to: recipientEmail,
              subject: "Your Account Deletion Request - KeshvaCredit",
              text: `Dear ${recipientName},\n\nWe have received your request to delete your KeshvaCredit account.\n\nYour account will be permanently deleted after 48 hours (by ${user.deleteAt.toLocaleString("en-IN", { timeZone: "Asia/Kolkata" })}). If you did not request this, please contact us immediately.\n\nPlease find attached a PDF summary of your account data for your records.\n\nRegards,\nKeshvaCredit Team`,
              pdfBuffer: pdfBuf,
              pdfFilename: `AccountDeletion_${user._id}.pdf`,
            });
          } catch (emailErr) {
            logger.error({ err: emailErr, id: user._id }, "Failed to send deletion PDF email");
          }
        })();

        logger.info(`Deletion scheduled for user ${user._id} at ${user.deleteAt}`);

        return res.status(200).json({
            success: true,
            message: "Account deletion scheduled successfully. Your account will be deleted after 48 hours.",
            deleteAt: user.deleteAt,
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

// Cancel Deletion Request
const cancelDeletionRequest = async (req, res) => {
    try {
        const { phone, email } = req.body;

        if (!phone || !email) {
            return res.status(400).json({
                success: false,
                message: "Phone and email are required."
            });
        }

        const resolved = await resolveUser(phone, email);
        if (!resolved) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        const { doc: user } = resolved;

        // Check if user has pending deletion request
        if (!user.deleteRequested || (user.accountStatus !== undefined && user.accountStatus !== 'pending_deletion')) {
            return res.status(400).json({
                success: false,
                message: "No pending deletion request found."
            });
        }

        // Cancel the deletion request
        user.deleteRequested = false;
        if (user.accountStatus !== undefined) user.accountStatus = 'active';
        user.deleteReason = null;
        user.deleteRequestedAt = null;
        user.deleteAt = null;

        await user.save();

        logger.info(`Deletion request cancelled for user ${user._id}`);

        return res.status(200).json({
            success: true,
            message: "Deletion request cancelled successfully.",
        });

    } catch (error) {
        logger.error(error);
        return res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

module.exports = { deleteUser, cancelDeletionRequest };
