const cron = require("node-cron");
const PersonalUser = require("../model/personalmodel");
const FormUser = require("../model/userdata");
const DeletedUser = require("../model/deleteusermodel");
const logger = require("../config/logger");
const { generatePDF } = require("../services/pdfGenerator");
const { sendApplicationEmail } = require("../services/emailSender");

/**
 * Move a user document (from either collection) into the DeletedUsers archive.
 */
async function archiveUser(user, source) {
  const now = new Date();

  let recordData;
  if (source === "personal") {
    recordData = {
      person_name: user.person_name,
      person_email: user.person_email,
      person_phone: user.person_phone,
      person_pan: user.person_pan,
      person_dob: user.person_dob,
      person_aadhar: user.person_aadhar,
      person_name_as_per_aadhar: user.person_name_as_per_aadhar,
      employment_type: user.employment_type,
      person_age: user.person_age,
      loan_purpose: user.loan_purpose,
      annual_income: user.annual_income,
      person_location: user.person_location,
      personal_loan_amount: user.personal_loan_amount,
      deleteReason: user.deleteReason,
      deleteRequestedAt: user.deleteRequestedAt,
      deletedAt: now,
      originalUserData: user.toObject(),
    };
  } else {
    // Form user — map fields to a consistent shape
    recordData = {
      person_name: user.name,
      person_email: user.email,
      person_phone: user.phone,
      person_pan: user.pan,
      person_dob: user.dob,
      employment_type: user.employment_type,
      person_age: user.age,
      annual_income: user.income,
      person_location: `${user.city}, ${user.state}`,
      deleteReason: user.deleteReason,
      deleteRequestedAt: user.deleteRequestedAt,
      deletedAt: now,
      originalUserData: user.toObject(),
    };
  }

  const deletedUser = new DeletedUser(recordData);
  await deletedUser.save();

  // Mark as deleted
  user.accountStatus = "deleted";
  user.isDeleted = true;
  await user.save();

  logger.info(
    `Archived user ${recordData.person_email || "unknown"} (source: ${source}) to DeletedUsers`,
  );

  // ── After archiving, generate final deletion PDF and send confirmation email.
  (async () => {
    try {
      // Field maps — mirror those used by deleteusercontroller for consistency
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
        deletedAt: "Deleted At",
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
        deletedAt: "Deleted At",
      };

      // Use the original user data snapshot saved in the deleted record if available,
      // otherwise fall back to the live user object.
      const original = (deletedUser.originalUserData && typeof deletedUser.originalUserData === 'object')
        ? deletedUser.originalUserData
        : user.toObject();

      // Add deletion metadata for clarity
      original.deleteReason = recordData.deleteReason || original.deleteReason;
      original.deletedAt = recordData.deletedAt || new Date();

      const fieldMap = source === "personal" ? personalFieldMap : formFieldMap;

      const loanType = source === "personal" ? "Personal Loan - Account Deleted" : "Form User - Account Deleted";
      const pdfBuf = await generatePDF(loanType, original, fieldMap);

      const recipientName = source === "personal" ? original.person_name || original.name : original.name || original.person_name;
      const recipientEmail = source === "personal" ? original.person_email : original.email;

      if (recipientEmail) {
        await sendApplicationEmail({
          to: recipientEmail,
          subject: "Your KeshvaCredit Account Has Been Deleted",
          text: `Dear ${recipientName || 'user'},\n\nYour KeshvaCredit account has been permanently deleted and archived from our system. Please find an attached PDF summary of your archived account data for your records.\n\nRegards,\nKeshvaCredit Team`,
          pdfBuffer: pdfBuf,
          pdfFilename: `AccountDeleted_${deletedUser._id}.pdf`,
        });
        logger.info({ to: recipientEmail, userId: user._id }, "Sent account deletion email with PDF");
      } else {
        logger.warn({ userId: user._id }, "No recipient email available to send deletion PDF");
      }
    } catch (err) {
      logger.error({ err, userId: user._id }, "Failed to generate/send deletion PDF email");
    }
  })();
}

/**
 * Find and archive all users past their deletion date.
 */
async function processCollection(Model, source) {
  const now = new Date();
  const users = await Model.find({
    deleteRequested: true,
    deleteAt: { $lte: now },
    accountStatus: "pending_deletion",
  });

  for (const user of users) {
    try {
      await archiveUser(user, source);
    } catch (err) {
      logger.error({ err, userId: user._id, source }, "Failed to archive user");
    }
  }

  return users.length;
}

// Run every hour
const scheduleDeletionCheck = () => {
  cron.schedule("0 * * * *", async () => {
    try {
      logger.info("Running scheduled deletion check...");

      const personalCount = await processCollection(PersonalUser, "personal");
      const formCount = await processCollection(FormUser, "form");

      if (personalCount + formCount === 0) {
        logger.info("No users to delete at this time.");
      } else {
        logger.info(
          `Deleted ${personalCount} personal + ${formCount} form users.`,
        );
      }
    } catch (error) {
      logger.error("Error in scheduled deletion check:", error);
    }
  });
};

module.exports = { scheduleDeletionCheck };
