const User = require("../model/userdata");
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

        const deletedUser = await User.findOne({ 
            phone: phone,
            email: email 
        });

        if (!deletedUser) {
            return res.status(404).json({
                success: false,
                message: "User not found with this phone and email combination"
            });
        }

        await DeletedUser.create({
            name: deletedUser.name,
            phone: deletedUser.phone,
            email: deletedUser.email,
            pan: deletedUser.pan,
            dob: deletedUser.dob,
            age: deletedUser.age,
            income: deletedUser.income,
            loan_amount: deletedUser.loan_amount,
            employment_type: deletedUser.employment_type,
            pincode: deletedUser.pincode,
            city: deletedUser.city,
            state: deletedUser.state,
            reason: reason || "User requested deletion"
        });

        await User.findByIdAndDelete(deletedUser._id);

        logger.info(`User deleted successfully: ${email}, ${phone}`);
        res.status(200).json({
            success: true,
            message: "User deleted successfully and data shifted to deleteuser collection",
            data: deletedUser
        });
    } catch (error) {
        logger.error(`Error deleting user: ${error.message}`);
        res.status(500).json({
            success: false,
            message: "Internal server error",
            error: error.message
        });
    }
};

module.exports = {
    deleteUser
};
