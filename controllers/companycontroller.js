const Company = require("../model/company");
const User = require("../model/userdata"); // Added to fetch user data by phone number
const mongoose = require("mongoose");

// ─────────────────────────────────────────
// HELPER: Calculate Age
// ─────────────────────────────────────────

const calculateAge = (dob) => {

    const birthDate = new Date(dob);

    if (isNaN(birthDate.getTime())) return null;

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();

    if (
        today.getMonth() < birthDate.getMonth() ||
        (today.getMonth() === birthDate.getMonth() &&
            today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};

// ─────────────────────────────────────────
// HELPER: Check User Eligibility
// ─────────────────────────────────────────
const isUserEligibleForCompany = (user, company) => {
    const userAge = user.age || calculateAge(user.dob);
    const ageOk = userAge >= company.min_age && userAge <= company.max_age;
    const incomeOk = Number(user.income) >= company.min_income;
    const loanOk = Number(user.loan_amount) <= company.max_loan;

    const employmentOk = Array.isArray(company.allowed_employment) && company.allowed_employment.some(
        (employment) => employment.toLowerCase() === String(user.employment_type || "").toLowerCase()
    );

    return ageOk && incomeOk && loanOk && employmentOk;
};

// ─────────────────────────────────────────
// ADD COMPANY
// ─────────────────────────────────────────
const addCompany = async (req, res) => {
    try {
        const {
            company_name,
            min_age,
            max_age,
            min_income,
            max_loan,
            interest_rate,
            loan_types,
            allowed_employment,
            allowed_business_types,
            min_business_age,
            max_business_age
        } = req.body;

        // Required checks
        if (!company_name) return res.status(400).json({ message: "COMPANY NAME IS REQUIRED" });
        if (min_age === undefined) return res.status(400).json({ message: "MIN AGE IS REQUIRED" });
        if (max_age === undefined) return res.status(400).json({ message: "MAX AGE IS REQUIRED" });
        if (min_income === undefined) return res.status(400).json({ message: "MIN INCOME IS REQUIRED" });
        if (max_loan === undefined) return res.status(400).json({ message: "MAX LOAN IS REQUIRED" });
        if (interest_rate === undefined) return res.status(400).json({ message: "INTEREST RATE IS REQUIRED" });
        if (!allowed_employment) return res.status(400).json({ message: "ALLOWED EMPLOYMENT IS REQUIRED" });

        // Type checks
        if (isNaN(min_age)) return res.status(400).json({ message: "MIN AGE MUST BE A NUMBER" });
        if (isNaN(max_age)) return res.status(400).json({ message: "MAX AGE MUST BE A NUMBER" });
        if (isNaN(min_income)) return res.status(400).json({ message: "MIN INCOME MUST BE A NUMBER" });
        if (isNaN(max_loan)) return res.status(400).json({ message: "MAX LOAN MUST BE A NUMBER" });
        if (isNaN(interest_rate)) return res.status(400).json({ message: "INTEREST RATE MUST BE A NUMBER" });
        if (loan_types && !Array.isArray(loan_types)) {
            return res.status(400).json({ message: "LOAN TYPES MUST BE AN ARRAY" });
        }
        if (!Array.isArray(allowed_employment)) {
            return res.status(400).json({ message: "ALLOWED EMPLOYMENT MUST BE AN ARRAY" });
        }
        if (allowed_business_types && !Array.isArray(allowed_business_types)) {
            return res.status(400).json({ message: "ALLOWED BUSINESS TYPES MUST BE AN ARRAY" });
        }
        if (min_business_age !== undefined && isNaN(min_business_age)) {
            return res.status(400).json({ message: "MIN BUSINESS AGE MUST BE A NUMBER" });
        }
        if (max_business_age !== undefined && isNaN(max_business_age)) {
            return res.status(400).json({ message: "MAX BUSINESS AGE MUST BE A NUMBER" });
        }

        // Duplicate check
        const existingCompany = await Company.findOne({ company_name });
        if (existingCompany) {
            return res.status(409).json({ message: "COMPANY ALREADY EXISTS" });
        }

        // Save
        const company = new Company({
            company_name,
            min_age,
            max_age,
            min_income,
            max_loan,
            interest_rate,
            loan_types: loan_types || [],
            allowed_employment,
            allowed_business_types: allowed_business_types || [],
            min_business_age,
            max_business_age
        });

        await company.save();

        return res.status(201).json({
            message: "COMPANY ADDED SUCCESSFULLY",
            data: company
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};


// ─────────────────────────────────────────
// COMPARE LIVE LOANS (Find saved user by phone)
// ─────────────────────────────────────────
const compareLiveLoans = async (req, res) => {
    try {
        const { phone } = req.body;

        if (!phone) return res.status(400).json({ message: "PHONE IS REQUIRED" });

        if (String(phone).length !== 10 || isNaN(phone)) {
            return res.status(400).json({ message: "PHONE NUMBER MUST BE 10 DIGITS" });
        }

        const user = await User.findOne({ phone: String(phone) });
        if (!user) {
            return res.status(404).json({
                message: "NO USER FOUND WITH THIS PHONE NUMBER. PLEASE COMPLETE THE REGISTRATION FORM FIRST."
            });
        }

        const userAge = user.age || calculateAge(user.dob);
        if (!userAge || !user.income || !user.loan_amount || !user.employment_type) {
            return res.status(400).json({
                message: "USER PROFILE IS INCOMPLETE FOR ELIGIBILITY CHECK"
            });
        }

        const userForEligibility = {
            ...user.toObject(),
            age: userAge,
            income: Number(user.income),
            loan_amount: Number(user.loan_amount)
        };

        const companies = await Company.find();
        const eligibleCompanies = companies.filter(company => isUserEligibleForCompany(userForEligibility, company));

        return res.status(200).json({
            success: true,
            message: eligibleCompanies.length > 0 ? "ELIGIBLE COMPANIES FOUND" : "NO ELIGIBLE COMPANY FOUND FOR THIS USER",
            user: userForEligibility,
            companiesChecked: companies.length,
            total: eligibleCompanies.length,
            eligible_companies: eligibleCompanies
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

// ─────────────────────────────────────────
// UPDATE COMPANY (FIXED & TESTED)
// ─────────────────────────────────────────
const getCompanyById = async (req, res) => {
    try {
        const { id } = req.params;

        if (!mongoose.Types.ObjectId.isValid(id)) {
            return res.status(400).json({ message: "INVALID COMPANY ID" });
        }

        const company = await Company.findById(id);
        if (!company) {
            return res.status(404).json({ message: "COMPANY NOT FOUND" });
        }

        return res.status(200).json({
            message: "COMPANY FOUND SUCCESSFULLY",
            data: company
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

const updateCompany = async (req, res) => {
    try {
        const { company_name, ...updateData } = req.body;

        if (!company_name) {
            return res.status(400).json({ message: "COMPANY NAME IS REQUIRED FOR UPDATE" });
        }

        const company = await Company.findOneAndUpdate(
            { company_name },
            updateData,
            { returnDocument: "after" }
        );

        if (!company) {
            return res.status(404).json({ message: "COMPANY NOT FOUND" });
        }

        return res.status(200).json({
            message: "COMPANY UPDATED SUCCESSFULLY",
            data: company
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};


const removeCompany = async (req, res) => {
    try {
        const { company_name } = req.body; // Fixed typo 'compnay_name'

        if (!company_name) {
            return res.status(400).json({ message: "COMPANY NAME IS REQUIRED" });
        }

        // Fixed: Swapped wrong findById syntax for explicit string target tracking evaluation query
        const company = await Company.findOneAndDelete({ company_name });

        if (!company) {
            return res.status(404).json({ message: "COMPANY NOT FOUND" });
        }

        return res.status(200).json({
            message: "COMPANY DELETED SUCCESSFULLY",
            deleted_company: company_name
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

module.exports = {
    addCompany,
    compareLiveLoans,
    getCompanyById,
    updateCompany,
    removeCompany
};
