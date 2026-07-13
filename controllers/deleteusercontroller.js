const User = require("../model/partnermodel");
const DeletedUser = require("../model/deleteusermodel");
const logger = require("../config/logger");

const deleteUser = async (req, res) => {
    try {
        const { phone, email, reason } = req.body;

        if (!phone || !email) {
            return res.status(400).json({
                success: false,
                message: "Both phone and email are required"
            });
        }

        const user = await User.findOne({
            phone,
            email
        });

        if (!user) {
            return res.status(404).json({
                success: false,
                message: "User not found"
            });
        }

        if (user.deleteRequested) {
            return res.status(400).json({
                success: false,
                message: "Account deletion request already exists."
            });
        }

        // Save backup only once
        await DeletedUser.create({
            name: user.name,
            phone: user.phone,
            email: user.email,
            pan: user.pan,
            dob: user.dob,
            age: user.age,
            income: user.income,
            loan_amount: user.loan_amount,
            employment_type: user.employment_type,
            pincode: user.pincode,
            city: user.city,
            state: user.state,
            reason: reason || "User requested deletion",
            deleteRequestedAt: new Date()
        });

        // Schedule deletion after 48 hours
        user.deleteRequested = true;
        user.deleteReason = reason || "User requested deletion";
        user.deleteAt = new Date(Date.now() + 48 * 60 * 60 * 1000);

        await user.save();

        logger.info(`Deletion scheduled for ${email}`);

        res.status(200).json({
            success: true,
            message: "Your account will be permanently deleted after 48 hours.",
            deleteAt: user.deleteAt
        });

    } catch (error) {
        logger.error(error.message);

        res.status(500).json({
            success: false,
            message: "Internal Server Error",
            error: error.message
        });
    }
};

module.exports = {
    deleteUser
};