const Business = require("../model/businessmodel");
const BusinessLender = require("../model/businesslender");
const mongoose = require("mongoose");

const isBusinessEligibleForLender = (business, lender) => {

    const ageOk = lender.business_age 
        ? Number(business.business_age) >= Number(lender.business_age) 
        : true;

    const revenueOk = lender.annual_revenue 
        ? Number(business.annual_revenue) >= Number(lender.annual_revenue) 
        : true;


    const loanOk = lender.business_loan_amount 
        ? Number(business.business_loan_amount) <= Number(lender.business_loan_amount)  
        : true;

    const typeOk = !lender.business_type || 
        String(lender.business_type).toLowerCase() === String(business.business_type || "").toLowerCase();

    return ageOk && revenueOk && loanOk && typeOk;
};


const addBusinessLender = async (req, res) => {
    try {
        const {
            business_name,
            business_type,
            business_age,
            annual_revenue,
            business_loan_amount,
            business_location,
            business_loan_purpose,
            business_owner_name,
            business_owner_email,
            business_owner_phone,
            business_owner_pan,
            business_pan,
            Udyam_Registration_Number,
            gst_number,
            msme_registration_number
        } = req.body;

        if (!business_name) return res.status(400).json({ message: "BUSINESS LENDER NAME IS REQUIRED" });
        if (business_age === undefined) return res.status(400).json({ message: "MINIMUM BUSINESS AGE IS REQUIRED" });
        if (annual_revenue === undefined) return res.status(400).json({ message: "MINIMUM ANNUAL REVENUE IS REQUIRED" });
        if (business_loan_amount === undefined) return res.status(400).json({ message: "MAXIMUM LOAN AMOUNT IS REQUIRED" });

        if (isNaN(business_age)) return res.status(400).json({ message: "BUSINESS AGE MUST BE A NUMBER" });
        if (isNaN(annual_revenue)) return res.status(400).json({ message: "ANNUAL REVENUE MUST BE A NUMBER" });
        if (isNaN(business_loan_amount)) return res.status(400).json({ message: "BUSINESS LOAN AMOUNT MUST BE A NUMBER" });


        const existingLender = await BusinessLender.findOne({ business_name });
        if (existingLender) {
            return res.status(409).json({ message: "BUSINESS LENDER PROFILE ALREADY EXISTS" });
        }

        const lender = new BusinessLender({
            business_name,
            business_type,
            business_age,
            annual_revenue,
            business_loan_amount,
            business_location,
            business_loan_purpose,
            business_owner_name,
            business_owner_email,
            business_owner_phone,
            business_owner_pan,
            business_pan,
            Udyam_Registration_Number,
            gst_number,
            msme_registration_number
        });

        await lender.save();

        return res.status(201).json({
            message: "BUSINESS LENDER ADDED SUCCESSFULLY",
            data: lender
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};


const getLenderById = async (req, res) => {
    try {
        const lender = await BusinessLender.findById(req.params.id);
        if (!lender) {
            return res.status(404).json({ message: "BUSINESS LENDER NOT FOUND" });
        }
        return res.status(200).json({ success: true, data: lender });
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

const compareBusinessLoans = async (req, res) => {
    try {
        const { business_owner_phone } = req.body;

        if (!business_owner_phone) {
            return res.status(400).json({ message: "BUSINESS OWNER PHONE NUMBER IS REQUIRED" });
        }

        if (String(business_owner_phone).length !== 10 || isNaN(business_owner_phone)) {
            return res.status(400).json({ message: "PHONE NUMBER MUST BE A VALID 10-DIGIT NUMBER" });
        }

        const businessProfile = await Business.findOne({ business_owner_phone: Number(business_owner_phone) });
        if (!businessProfile) {
            return res.status(404).json({
                message: "NO BUSINESS FOUND WITH THIS PHONE NUMBER. PLEASE REGISTER THE BUSINESS PROFILE FIRST."
            });
        }

        if (!businessProfile.business_age || !businessProfile.annual_revenue || !businessProfile.business_loan_amount) {
            return res.status(400).json({
                message: "BUSINESS PROFILE CONTENT IS INCOMPLETE FOR GENERATING LENDER MATCHES"
            });
        }


        const businessData = {
            ...businessProfile.toObject(),
            business_age: Number(businessProfile.business_age),
            annual_revenue: Number(businessProfile.annual_revenue),
            business_loan_amount: Number(businessProfile.business_loan_amount)
        };

        const lenders = await BusinessLender.find();
        const eligibleLenders = lenders.filter(lender => isBusinessEligibleForLender(businessData, lender));

        return res.status(200).json({
            success: true,
            message: eligibleLenders.length > 0 ? "ELIGIBLE BUSINESS LENDERS FOUND" : "NO ELIGIBLE LENDERS FOUND FOR THIS BUSINESS PROFILE",
            business_profile: businessData,
            lendersChecked: lenders.length,
            total_matches: eligibleLenders.length,
            eligible_lenders: eligibleLenders
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

const updateBusinessLender = async (req, res) => {
    try {
        const { business_name, ...updateData } = req.body;

        if (!business_name) {
            return res.status(400).json({ message: "BUSINESS LENDER NAME IS REQUIRED FOR UPDATE" });
        }

        const updatedLender = await BusinessLender.findOneAndUpdate(
            { business_name },
            updateData,
            { returnDocument: "after" }
        );

        if (!updatedLender) {
            return res.status(404).json({ message: "BUSINESS LENDER NOT FOUND" });
        }

        return res.status(200).json({
            message: "BUSINESS LENDER UPDATED SUCCESSFULLY",
            data: updatedLender
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};


const removeBusinessLender = async (req, res) => {
    try {
        const { business_name } = req.body;

        if (!business_name) {
            return res.status(400).json({ message: "BUSINESS LENDER NAME IS REQUIRED FOR DELETION" });
        }

        const deletedLender = await BusinessLender.findOneAndDelete({ business_name });

        if (!deletedLender) {
            return res.status(404).json({ message: "BUSINESS LENDER NOT FOUND" });
        }

        return res.status(200).json({
            message: "BUSINESS LENDER PROFILE DELETED SUCCESSFULLY",
            deleted_lender: business_name
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

module.exports = {
    addBusinessLender,
    compareBusinessLoans,
    getLenderById,
    updateBusinessLender,
    removeBusinessLender
};
