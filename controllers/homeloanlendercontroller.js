const HomeLoanLender = require("../model/homeloanlendermodel");


const addHomeLoanLender = async (req, res) => {
    try {
        const {
            lender_name,
            min_loan_amount,
            max_loan_amount,
            min_applicant_age,
            max_applicant_age,
            min_annual_income,
            min_property_value,
            property_types_accepted,
            interest_rate
        } = req.body;

        if (!lender_name) return res.status(400).json({ message: "LENDER NAME IS REQUIRED" });
        if (!min_loan_amount) return res.status(400).json({ message: "MINIMUM LOAN AMOUNT IS REQUIRED" });
        if (!max_loan_amount) return res.status(400).json({ message: "MAXIMUM LOAN AMOUNT IS REQUIRED" });
        if (!min_applicant_age) return res.status(400).json({ message: "MINIMUM APPLICANT AGE IS REQUIRED" });
        if (!max_applicant_age) return res.status(400).json({ message: "MAXIMUM APPLICANT AGE IS REQUIRED" });
        if (!min_annual_income) return res.status(400).json({ message: "MINIMUM ANNUAL INCOME IS REQUIRED" });
        if (!interest_rate) return res.status(400).json({ message: "INTEREST RATE IS REQUIRED" });

        const existingLender = await HomeLoanLender.findOne({ lender_name });
        if (existingLender) {
            return res.status(409).json({ message: "HOME LOAN LENDER ALREADY EXISTS" });
        }

        const lender = new HomeLoanLender({
            lender_name,
            min_loan_amount,
            max_loan_amount,
            min_applicant_age,
            max_applicant_age,
            min_annual_income,
            min_property_value: min_property_value || null,
            property_types_accepted: property_types_accepted || "All",
            interest_rate
        });

        await lender.save();

        return res.status(201).json({
            success: true,
            message: "HOME LOAN LENDER ADDED SUCCESSFULLY",
            data: lender
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const getAllHomeLoanLenders = async (req, res) => {
    try {
        const lenders = await HomeLoanLender.find();
        return res.status(200).json({
            success: true,
            total: lenders.length,
            data: lenders
        });
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

const getLenderByName = async (req, res) => {
    try {
        const { lender_name } = req.body;

        if (!lender_name) {
            return res.status(400).json({ message: "LENDER NAME IS REQUIRED" });
        }

        const lender = await HomeLoanLender.findOne({ lender_name });

        if (!lender) {
            return res.status(404).json({ message: "LENDER NOT FOUND" });
        }

        return res.status(200).json({ success: true, data: lender });
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

const updateHomeLoanLender = async (req, res) => {
    try {
        const { lender_name, ...updateData } = req.body;

        if (!lender_name) {
            return res.status(400).json({ message: "LENDER NAME IS REQUIRED" });
        }

        const updatedLender = await HomeLoanLender.findOneAndUpdate(
            { lender_name },
            updateData,
            { new: true, runValidators: true }
        );

        if (!updatedLender) {
            return res.status(404).json({ message: "LENDER NOT FOUND" });
        }

        return res.status(200).json({
            success: true,
            message: "LENDER UPDATED SUCCESSFULLY",
            data: updatedLender
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

const deleteHomeLoanLender = async (req, res) => {
    try {
        const { lender_name } = req.body;

        if (!lender_name) {
            return res.status(400).json({ message: "LENDER NAME IS REQUIRED" });
        }

        const deletedLender = await HomeLoanLender.findOneAndDelete({ lender_name });

        if (!deletedLender) {
            return res.status(404).json({ message: "LENDER NOT FOUND" });
        }

        return res.status(200).json({
            success: true,
            message: "LENDER DELETED SUCCESSFULLY",
            deleted_lender: lender_name
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

module.exports = {
    addHomeLoanLender,
    getAllHomeLoanLenders,
    getLenderByName,
    updateHomeLoanLender,
    deleteHomeLoanLender
};