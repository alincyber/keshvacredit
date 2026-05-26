const User = require("../model/userdata");
const Company = require("../model/company");
const mongoose = require("mongoose");

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const toTextArray = (value) => Array.isArray(value) ? value : String(value || "").split(",");

const compareUserWithCompanies = (user, companies) => {
    const comparedCompanies = companies.map(company => {
        const incomeCheck = Number(user.income) >= Number(company.min_income);
        const loanAmountCheck = Number(user.loan_amount) <= Number(company.max_loan);

        const employmentCheck = toTextArray(company.allowed_employment)
            .map(normalizeText)
            .includes(normalizeText(user.employment_type));

        const stateCheck = toTextArray(company.serviceable_states)
            .map(normalizeText)
            .includes(normalizeText(user.state));

        const isEligible = incomeCheck && loanAmountCheck && employmentCheck && stateCheck;

        return {
            company,
            isEligible,
            checks: {
                incomeCheck,
                loanAmountCheck,
                employmentCheck,
                stateCheck
            }
        };
    });

    const eligibleCompanies = comparedCompanies
        .filter(result => result.isEligible)
        .map(result => result.company);

    return {
        eligibleCompanies,
        comparedCompanies
    };
};

const buildCompareResponse = (user, companies, eligibleCompanies, comparedCompanies) => ({
    success: true,
    message: eligibleCompanies.length > 0
        ? "ELIGIBLE COMPANIES FOUND"
        : "NO ELIGIBLE COMPANY FOUND FOR THIS USER",
    user,
    companiesChecked: companies.length,
    total: eligibleCompanies.length,
    data: eligibleCompanies,
    comparison: comparedCompanies
});

const compareLoans = async (req, res) => {

    try {

        const userId = req.params.id;

        if (!mongoose.Types.ObjectId.isValid(userId)) {
            return res.status(400).json({
                message: "INVALID USER ID"
            });
        }

        // Find user
        const user = await User.findById(userId);

        if (!user) {
            return res.status(404).json({
                message: "User not found"
            });
        }

        // Get all companies and compare user data with each company's rules.
        const companies = await Company.find();

        if (companies.length === 0) {
            return res.status(200).json({
                success: true,
                message: "NO COMPANIES FOUND. PLEASE ADD COMPANY FIRST.",
                user,
                companiesChecked: 0,
                total: 0,
                data: [],
                comparison: []
            });
        }

        const { eligibleCompanies, comparedCompanies } = compareUserWithCompanies(user, companies);

        res.status(200).json(
            buildCompareResponse(user, companies, eligibleCompanies, comparedCompanies)
        );

    } catch (error) {

        res.status(500).json({
            message: error.message
        });
    }
};

const compareLiveLoans = async (req, res) => {
    try {
        const {
            income,
            loan_amount,
            employment_type,
            state
        } = req.body;

        if (!income || !loan_amount || !employment_type || !state) {
            return res.status(400).json({
                message: "INCOME, LOAN AMOUNT, EMPLOYMENT TYPE AND STATE ARE REQUIRED"
            });
        }

        if (isNaN(income)) {
            return res.status(400).json({
                message: "INCOME MUST BE A NUMBER"
            });
        }

        if (isNaN(loan_amount)) {
            return res.status(400).json({
                message: "LOAN AMOUNT MUST BE A NUMBER"
            });
        }

        const formUser = {
            income: Number(income),
            loan_amount: Number(loan_amount),
            employment_type,
            state
        };

        const companies = await Company.find();

        if (companies.length === 0) {
            return res.status(200).json({
                success: true,
                message: "NO COMPANIES FOUND. PLEASE ADD COMPANY FIRST.",
                user: formUser,
                companiesChecked: 0,
                total: 0,
                data: [],
                comparison: []
            });
        }

        const { eligibleCompanies, comparedCompanies } = compareUserWithCompanies(formUser, companies);

        return res.status(200).json(
            buildCompareResponse(formUser, companies, eligibleCompanies, comparedCompanies)
        );
    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

module.exports = {
    compareLoans,
    compareLiveLoans
};
