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
    const ageOk = user.age >= company.min_age && user.age <= company.max_age;
    const incomeOk = user.income >= company.min_income;
    const loanOk = user.loan_amount <= company.max_loan;

    const employmentOk = company.allowed_employment.some(
        (employment) => employment.toLowerCase() === user.employment_type.toLowerCase()
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
// COMPARE LIVE LOANS (Direct single-form processing)
// ─────────────────────────────────────────
const compareLiveLoans = async (req, res) => {
    try {
        const {
            name, phone, email, pan, dob, income,
            loan_amount, employment_type, pincode, city, state
        } = req.body;

        // Required checks
        if (!name) return res.status(400).json({ message: "NAME IS REQUIRED" });
        if (!phone) return res.status(400).json({ message: "PHONE IS REQUIRED" });
        if (!email) return res.status(400).json({ message: "EMAIL IS REQUIRED" });
        if (!pan) return res.status(400).json({ message: "PAN IS REQUIRED" });
        if (!dob) return res.status(400).json({ message: "DOB IS REQUIRED" });
        if (!income) return res.status(400).json({ message: "INCOME IS REQUIRED" });
        if (!loan_amount) return res.status(400).json({ message: "LOAN AMOUNT IS REQUIRED" });
        if (!employment_type) return res.status(400).json({ message: "EMPLOYMENT TYPE IS REQUIRED" });
        if (!pincode) return res.status(400).json({ message: "PINCODE IS REQUIRED" });
        if (!city) return res.status(400).json({ message: "CITY IS REQUIRED" });
        if (!state) return res.status(400).json({ message: "STATE IS REQUIRED" });

        // Field validations
        if (String(phone).length !== 10 || isNaN(phone)) {
            return res.status(400).json({ message: "PHONE NUMBER MUST BE 10 DIGITS" });
        }
        if (!String(email).includes("@gmail") || !String(email).includes(".com")) {
            return res.status(400).json({ message: "PLEASE ENTER A VALID GMAIL ADDRESS" });
        }
        if (String(pan).length !== 10) {
            return res.status(400).json({ message: "PAN CARD MUST BE 10 CHARACTERS" });
        }
        if (String(dob).length !== 10 || dob[4] !== "-" || dob[7] !== "-") {
            return res.status(400).json({ message: "DOB FORMAT MUST BE YYYY-MM-DD" });
        }
        if (isNaN(income)) return res.status(400).json({ message: "INCOME MUST BE A NUMBER" });
        if (isNaN(loan_amount)) return res.status(400).json({ message: "LOAN AMOUNT MUST BE A NUMBER" });
        if (Number(income) < 10000) return res.status(400).json({ message: "MINIMUM INCOME MUST BE 10000" });
        if (Number(loan_amount) < 500) return res.status(400).json({ message: "MINIMUM LOAN AMOUNT MUST BE 500" });
        if (String(pincode).length !== 6 || isNaN(pincode)) {
            return res.status(400).json({ message: "PINCODE MUST BE 6 DIGITS" });
        }

        const userAge = calculateAge(dob);
        if (userAge === null) return res.status(400).json({ message: "INVALID DOB" });

        const user = {
            name, phone, email, pan, dob, age: userAge,
            income: Number(income), loan_amount: Number(loan_amount),
            employment_type, pincode, city, state
        };

        const companies = await Company.find();
        const eligibleCompanies = companies.filter(company => isUserEligibleForCompany(user, company));

        return res.status(200).json({
            success: true,
            message: eligibleCompanies.length > 0 ? "ELIGIBLE COMPANIES FOUND" : "NO ELIGIBLE COMPANY FOUND FOR THIS USER",
            user,
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
    applyWithPhone, // Exported new popup verification workflow handler
    updateCompany,
    removeCompany
};
