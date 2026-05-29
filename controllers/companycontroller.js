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
            allowed_employment
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
        if (!Array.isArray(allowed_employment)) {
            return res.status(400).json({ message: "ALLOWED EMPLOYMENT MUST BE AN ARRAY" });
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
            allowed_employment
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
// GET ALL COMPANIES
// ─────────────────────────────────────────
const getCompanies = async (req, res) => {
    try {
        const companies = await Company.find();
        return res.status(200).json({
            success: true,
            total: companies.length,
            data: companies
        });
    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

// ─────────────────────────────────────────
// GET COMPANY BY ID
// ─────────────────────────────────────────
const getCompanyById = async (req, res) => {
    try {
        const company = await Company.findById(req.params.id);
        if (!company) {
            return res.status(404).json({ message: "COMPANY NOT FOUND" });
        }
        return res.status(200).json({ success: true, data: company });
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
// NEW FEATURE: APPLY VIA POPUP (BY PHONE)
// ─────────────────────────────────────────
const applyWithPhone = async (req, res) => {
    try {
        const { phone, company_id } = req.body;

        if (!phone) return res.status(400).json({ message: "PHONE NUMBER IS REQUIRED" });
        if (!company_id) return res.status(400).json({ message: "COMPANY ID IS REQUIRED" });

        // 1. Grab user data from database collection matching the verified phone number
        const user = await User.findOne({ phone });
        if (!user) {
            return res.status(404).json({ 
                message: "NO PROFILE FOUND WITH THIS PHONE NUMBER. PLEASE COMPLETE THE REGISTRATION FORM FIRST." 
            });
        }

        // 2. Locate targeted lender profile properties via ID parameter reference
        const company = await Company.findById(company_id);
        if (!company) {
            return res.status(404).json({ message: "SELECTED LENDER PROFILE NOT FOUND" });
        }

        // 3. Verify parameters
        const isEligible = isUserEligibleForCompany(user, company);

        if (!isEligible) {
            return res.status(200).json({
                success: false,
                message: `APPLICATION DECLINED: PROFILE CRITERIA DOES NOT MATCH ${company.company_name.toUpperCase()} REQUIREMENT POLICIES.`
            });
        }

        return res.status(200).json({
            success: true,
            message: `ELIGIBILITY CONFIRMED! YOU QUALIFY FOR AN APPLICATION WITH ${company.company_name.toUpperCase()}.`,
            user_summary: {
                name: user.name,
                phone: user.phone,
                requested_loan: user.loan_amount
            },
            lender_summary: {
                company_name: company.company_name,
                interest_rate: company.interest_rate
            }
        });

    } catch (error) {
        return res.status(500).json({ message: "INTERNAL SERVER ERROR", error: error.message });
    }
};

// ─────────────────────────────────────────
// UPDATE COMPANY (FIXED & TESTED)
// ─────────────────────────────────────────
const updateCompany = async (req, res) => {
    try {
        const { company_name, ...updateData } = req.body;

        if (!company_name) {
            return res.status(400).json({ message: "COMPANY NAME IS REQUIRED FOR UPDATE" });
        }

        // Fixed: Swapped missing object reference configuration out for standard model lookup logic
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

// ─────────────────────────────────────────
// DELETE COMPANY (FIXED & TESTED)
// ─────────────────────────────────────────
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
    getCompanies,
    compareLiveLoans,
    getCompanyById,
    applyWithPhone,
    updateCompany,
    removeCompany
};
