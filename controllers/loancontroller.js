const User = require("../model/userdata");
const Company = require("../model/company");
const mongoose = require("mongoose");

const normalizeText = (value) => String(value || "").trim().toLowerCase();
const toTextArray = (value) => Array.isArray(value) ? value : String(value || "").split(",");

const calculateAge = (dob) => {
    const birthDate = new Date(dob);

    if (isNaN(birthDate.getTime())) {
        return null;
    }

    const today = new Date();
    let age = today.getFullYear() - birthDate.getFullYear();
    const monthDifference = today.getMonth() - birthDate.getMonth();

    if (
        monthDifference < 0 ||
        (monthDifference === 0 && today.getDate() < birthDate.getDate())
    ) {
        age--;
    }

    return age;
};

const validateUserForm = (user) => {
    const requiredFields = [
        "name",
        "phone",
        "email",
        "pan",
        "dob",
        "income",
        "loan_amount",
        "employment_type",
        "pincode",
        "city",
        "state"
    ];

    const missingField = requiredFields.find(field => !user[field]);

    if (missingField) {
        return `${missingField.toUpperCase()} IS REQUIRED`;
    }

    if (String(user.phone).length !== 10 || isNaN(user.phone)) {
        return "PHONE NUMBER MUST BE 10 DIGITS";
    }

    if (!String(user.email).includes("@gmail") || !String(user.email).includes(".com")) {
        return "PLEASE ENTER A VALID GMAIL ADDRESS";
    }

    if (String(user.pan).length !== 10) {
        return "PAN CARD MUST BE 10 CHARACTERS";
    }

    if (String(user.dob).length !== 10 || user.dob[4] !== "-" || user.dob[7] !== "-") {
        return "DOB FORMAT MUST BE YYYY-MM-DD";
    }

    if (isNaN(user.income)) {
        return "INCOME MUST BE A NUMBER";
    }

    if (isNaN(user.loan_amount)) {
        return "LOAN AMOUNT MUST BE A NUMBER";
    }

    if (Number(user.income) < 10000) {
        return "MINIMUM INCOME MUST BE 10000";
    }

    if (Number(user.loan_amount) < 500) {
        return "MINIMUM LOAN AMOUNT MUST BE 500";
    }

    if (String(user.pincode).length !== 6 || isNaN(user.pincode)) {
        return "PINCODE MUST BE 6 DIGITS";
    }

    return null;
};

const compareUserWithCompanies = (user, companies) => {
    const comparedCompanies = companies.map(company => {
        const ageCheck =
            Number(user.age) >= Number(company.min_age) &&
            Number(user.age) <= Number(company.max_age);

        const incomeCheck = Number(user.income) >= Number(company.min_income);
        const loanAmountCheck = Number(user.loan_amount) <= Number(company.max_loan);

        const employmentCheck = toTextArray(company.allowed_employment)
            .map(normalizeText)
            .includes(normalizeText(user.employment_type));

        const isEligible = ageCheck && incomeCheck && loanAmountCheck && employmentCheck;

        return {
            company,
            isEligible,
            checks: {
                ageCheck,
                incomeCheck,
                loanAmountCheck,
                employmentCheck
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
    eligible_companies: eligibleCompanies
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
        const user = await User.findById(userId).lean();

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
                eligible_companies: []
            });
        }

        user.age = calculateAge(user.dob);

        if (user.age === null) {
            return res.status(400).json({
                message: "INVALID USER DOB"
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
            name,
            phone,
            email,
            pan,
            dob,
            income,
            loan_amount,
            employment_type,
            pincode,
            city,
            state
        } = req.body;

        const formUser = {
            name,
            phone,
            email,
            pan,
            dob,
            income,
            loan_amount,
            employment_type,
            pincode,
            city,
            state
        };

        const validationError = validateUserForm(formUser);

        if (validationError) {
            return res.status(400).json({
                message: validationError
            });
        }

        const userForComparison = {
            ...formUser,
            age: calculateAge(dob),
            income: Number(income),
            loan_amount: Number(loan_amount)
        };

        if (userForComparison.age === null) {
            return res.status(400).json({
                message: "INVALID DOB"
            });
        }

        const companies = await Company.find();

        if (companies.length === 0) {
            return res.status(200).json({
                success: true,
                message: "NO COMPANIES FOUND. PLEASE ADD COMPANY FIRST.",
                user: userForComparison,
                companiesChecked: 0,
                total: 0,
                eligible_companies: [],
            });
        }

        const { eligibleCompanies, comparedCompanies } = compareUserWithCompanies(userForComparison, companies);

        return res.status(200).json(
            buildCompareResponse(userForComparison, companies, eligibleCompanies, comparedCompanies)
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
