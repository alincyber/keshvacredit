const User = require("../model/personalmodel");
const DeletedUser = require("../model/deleteusermodel");
const logger = require("../config/logger");

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

        // Find user
        const user = await User.findOne({ person_phone: phone, person_email: email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

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
        user.deleteRequestedAt = new Date(); // Store when request was made
        user.deleteAt = new Date(Date.now() + 48 * 60 * 60 * 1000); // 48 hours later
        user.accountStatus = "pending_deletion"; // Add status field

        await user.save();

        logger.info(`Deletion scheduled for ${user.email} at ${user.deleteAt}`);

        return res.status(200).json({
            success: true,
            message: "Account deletion scheduled successfully. Your account will be deleted after 48 hours.",
            deleteAt: user.deleteAt,
            accountStatus: user.accountStatus
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

        const user = await User.findOne({ person_phone: phone, person_email: email });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found."
            });
        }

        // Check if user has pending deletion request
        if (!user.deleteRequested || user.accountStatus !== 'pending_deletion') {
            return res.status(400).json({
                success: false,
                message: "No pending deletion request found."
            });
        }

        // Cancel the deletion request
        user.deleteRequested = false;
        user.accountStatus = 'active';
        user.deleteReason = null;
        user.deleteRequestedAt = null;
        user.deleteAt = null;

        await user.save();

        logger.info(`Deletion request cancelled for ${user.email}`);

        return res.status(200).json({
            success: true,
            message: "Deletion request cancelled successfully.",
            accountStatus: user.accountStatus
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
