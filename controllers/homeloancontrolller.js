const HomeLoan = require("../model/homeloanmodel");
const HomeLoanLender = require("../model/homeloanlendermodel");
const logger = require("../config/logger");

const isApplicantEligibleForLender = (applicant, lender) => {

    const ageOk = applicant.applicant_age >= lender.min_applicant_age && 
                  applicant.applicant_age <= lender.max_applicant_age;
    

    const incomeOk = applicant.annual_income >= lender.min_annual_income;

    const loanOk = applicant.loan_amount_requested >= lender.min_loan_amount && 
                   applicant.loan_amount_requested <= lender.max_loan_amount;
    
    const propertyOk = !lender.min_property_value || 
                       applicant.property_value >= lender.min_property_value;
    
    return ageOk && incomeOk && loanOk && propertyOk;
};

const createHomeLoan = async (req, res) => {
    try {
        const {
            applicant_name,
            applicant_email,
            applicant_phone,
            applicant_pan,
            applicant_aadhar,
            applicant_dob,
            applicant_age,
            employment_type,
            applicant_location,
            annual_income,
            work_experience_years,
            property_type,
            property_address,
            property_city,
            property_state,
            property_pincode,
            property_area_sqft,
            property_value,
            loan_amount_requested,
            loan_purpose,
            loan_tenure_years,
            down_payment
        } = req.body;


        if (!applicant_name || !applicant_email || !applicant_phone || !applicant_pan || 
            !applicant_aadhar || !applicant_dob || !applicant_age || !employment_type || 
            !applicant_location || !annual_income || !property_type || !property_address || 
            !property_city || !property_state || !property_pincode || !property_area_sqft || 
            !property_value || !loan_amount_requested || !loan_purpose || !loan_tenure_years) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER ALL THE REQUIRED DETAILS"
            });
        }

        const existingApplication = await HomeLoan.findOne({ 
            $or: [{ applicant_pan }, { applicant_phone }, { applicant_aadhar }] 
        });
        
        if (existingApplication) {
            return res.status(400).json({
                success: false,
                message: "APPLICATION WITH THIS PAN, PHONE OR AADHAR ALREADY EXISTS"
            });
        }

        if (String(applicant_phone).length !== 10 || isNaN(applicant_phone)) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER MUST BE 10 DIGITS"
            });
        }

        if (!applicant_email.includes("@")) {
            return res.status(400).json({
                success: false,
                message: "PLEASE ENTER A VALID EMAIL ADDRESS"
            });
        }


        if (String(applicant_aadhar).length !== 12 || isNaN(applicant_aadhar)) {
            return res.status(400).json({
                success: false,
                message: "AADHAR NUMBER MUST BE 12 DIGITS"
            });
        }


        const birthDate = new Date(applicant_dob);
        const today = new Date();
        let calculatedAge = today.getFullYear() - birthDate.getFullYear();
        const monthDiff = today.getMonth() - birthDate.getMonth();
        if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < birthDate.getDate())) {
            calculatedAge--;
        }
        
        if (calculatedAge !== applicant_age) {
            return res.status(400).json({
                success: false,
                message: "AGE DOES NOT MATCH WITH DATE OF BIRTH"
            });
        }

        if (applicant_age < 18 || applicant_age > 80) {
            return res.status(400).json({
                success: false,
                message: "AGE MUST BE BETWEEN 18 AND 80 YEARS"
            });
        }

        const homeLoanObj = new HomeLoan({
            applicant_name,
            applicant_email,
            applicant_phone,
            applicant_pan,
            applicant_aadhar,
            applicant_dob,
            applicant_age,
            employment_type,
            applicant_location,
            annual_income,
            work_experience_years: work_experience_years || 0,
            property_type,
            property_address,
            property_city,
            property_state,
            property_pincode,
            property_area_sqft,
            property_value,
            loan_amount_requested,
            loan_purpose,
            loan_tenure_years,
            down_payment: down_payment || 0
        });

        const savedApplication = await homeLoanObj.save();

        const lenders = await HomeLoanLender.find();
        
        const applicantData = {
            applicant_age: savedApplication.applicant_age,
            annual_income: savedApplication.annual_income,
            loan_amount_requested: savedApplication.loan_amount_requested,
            property_value: savedApplication.property_value
        };
        
        const eligibleLenders = lenders.filter(lender => isApplicantEligibleForLender(applicantData, lender));

        return res.status(201).json({
            success: true,
            message: "HOME LOAN APPLICATION SUBMITTED SUCCESSFULLY",
            data: {
                id: savedApplication._id,
                applicant_name: savedApplication.applicant_name,
                applicant_phone: savedApplication.applicant_phone,
                loan_amount: savedApplication.loan_amount_requested,
                property_value: savedApplication.property_value
            },
            lenders_checked: lenders.length,
            eligible_lenders_count: eligibleLenders.length,
            eligible_lenders: eligibleLenders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};


const getHomeLoanByPhone = async (req, res) => {
    try {
        const { applicant_phone } = req.body;

        if (!applicant_phone) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER IS REQUIRED"
            });
        }

        const application = await HomeLoan.findOne({ applicant_phone: String(applicant_phone) });

        if (!application) {
            return res.status(404).json({
                success: false,
                message: "APPLICATION NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            data: application
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};


const compareHomeLoanByPhone = async (req, res) => {
    try {
        const { applicant_phone } = req.body;

        if (!applicant_phone) {
            return res.status(400).json({
                success: false,
                message: "PHONE NUMBER IS REQUIRED"
            });
        }

        const application = await HomeLoan.findOne({ applicant_phone: String(applicant_phone) });
        
        if (!application) {
            return res.status(404).json({
                success: false,
                message: "NO APPLICATION FOUND WITH THIS PHONE NUMBER"
            });
        }

        const lenders = await HomeLoanLender.find();
        
        const applicantData = {
            applicant_age: application.applicant_age,
            annual_income: application.annual_income,
            loan_amount_requested: application.loan_amount_requested,
            property_value: application.property_value
        };
        
        const eligibleLenders = lenders.filter(lender => isApplicantEligibleForLender(applicantData, lender));

        return res.status(200).json({
            success: true,
            message: eligibleLenders.length > 0 ? "ELIGIBLE LENDERS FOUND" : "NO ELIGIBLE LENDERS FOUND",
            application_details: application,
            lenders_checked: lenders.length,
            eligible_lenders_count: eligibleLenders.length,
            eligible_lenders: eligibleLenders
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const updateHomeLoanByPan = async (req, res) => {
    try {
        const { applicant_pan } = req.body;

        if (!applicant_pan) {
            return res.status(400).json({
                success: false,
                message: "PAN NUMBER IS REQUIRED"
            });
        }

        const updatedApplication = await HomeLoan.findOneAndUpdate(
            { applicant_pan: applicant_pan },
            req.body,
            { new: true, runValidators: true }
        );

        if (!updatedApplication) {
            return res.status(404).json({
                success: false,
                message: "APPLICATION NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            message: "APPLICATION UPDATED SUCCESSFULLY",
            data: updatedApplication
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const deleteHomeLoanByPan = async (req, res) => {
    try {
        const { applicant_pan } = req.body;

        if (!applicant_pan) {
            return res.status(400).json({
                success: false,
                message: "PAN NUMBER IS REQUIRED"
            });
        }

        const deletedApplication = await HomeLoan.findOneAndDelete({ applicant_pan: applicant_pan });

        if (!deletedApplication) {
            return res.status(404).json({
                success: false,
                message: "APPLICATION NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            message: "APPLICATION DELETED SUCCESSFULLY",
            deleted_application: applicant_pan
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const getAllHomeLoans = async (req, res) => {
    try {
        const applications = await HomeLoan.find();
        return res.status(200).json({
            success: true,
            count: applications.length,
            data: applications
        });
    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

module.exports = {
    createHomeLoan,
    getHomeLoanByPhone,
    compareHomeLoanByPhone,
    updateHomeLoanByPan,
    deleteHomeLoanByPan,
    getAllHomeLoans
};
