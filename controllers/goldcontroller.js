const GoldLoan = require("../model/goldloanmodel");
const GoldLoanLender = require("../model/goldlendermodel");

const isMissing = (value) => value === undefined || value === null || value === "";
const toNumber = (value) => Number(value);

const isGoldLoanEligibleForLender = (goldLoan, lender) => {
    const requestedAmount = toNumber(goldLoan.gold_loan_amount || goldLoan.loan_amount);

    const loanOk = lender.loan_amount
        ? requestedAmount <= toNumber(lender.loan_amount)
        : true;
    const weightOk = lender.gold_weight
        ? toNumber(goldLoan.gold_weight) >= toNumber(lender.gold_weight)
        : true;
    const purityOk = lender.gold_purity
        ? toNumber(goldLoan.gold_purity) >= toNumber(lender.gold_purity)
        : true;
    const valueOk = lender.gold_value
        ? toNumber(goldLoan.gold_value) >= toNumber(lender.gold_value)
        : true;
    const formOk = !lender.gold_form ||
        String(lender.gold_form).toLowerCase() === String(goldLoan.gold_form || goldLoan.gold_type || "").toLowerCase();

    return loanOk && weightOk && purityOk && valueOk && formOk;
};
const createGoldLoan = async (req, res) => {
    try {
        const {
            owner_name,
            owner_email,
            owner_phone,
            owner_pan,
            owner_age,
            gold_loan_amount,
            interest_rate,
            loan_purpose,
            gold_weight,
            gold_purity,
            gold_value,
            gold_type,
            gold_form
        } = req.body;

        if (
              !owner_name|| !owner_email|| !owner_phone|| !owner_pan|| !owner_age|| !gold_loan_amount|| !interest_rate|| !loan_purpose|| !gold_weight|| !gold_purity|| !gold_value|| !gold_type || !gold_form
        ) {
            return res.status(400).json({
                message: "PLEASE ENTER ALL THE DETAILS"
            });
        }

        const existingGoldLoan = await GoldLoan.findOne({
            owner_phone,
            owner_pan
        });

        if (existingGoldLoan) {
            return res.status(400).json({
                message: "GOLD LOAN APPLICATION ALREADY EXISTS"
            });
        }

        if (String(owner_phone).length !== 10) {
            return res.status(400).json({
                message: "PHONE NUMBER MUST BE 10 DIGITS"
            });
        }

        if (isNaN(owner_phone)) {
            return res.status(400).json({
                message: "PHONE NUMBER MUST CONTAIN NUMBERS ONLY"
            });
        }

        if (
            owner_email &&
            !owner_email.includes("@gmail.com")
        ) {
            return res.status(400).json({
                message: "PLEASE ENTER A VALID GMAIL ADDRESS"
            });
        }

        const goldLoan = new GoldLoan({
            owner_name,
            owner_email,
            owner_phone,
            owner_pan,
            owner_age,
            gold_loan_amount,
            loan_amount: gold_loan_amount,
            interest_rate,
            loan_purpose,
            gold_weight,
            gold_purity,
            gold_value,
            gold_type: gold_type || gold_form,
            gold_form
        });

        const savedGoldLoan = await goldLoan.save();

        const goldLoanData = {
            ...savedGoldLoan.toObject(),
            gold_loan_amount: Number(savedGoldLoan.gold_loan_amount),
            loan_amount: Number(savedGoldLoan.loan_amount),
            gold_weight: Number(savedGoldLoan.gold_weight),
            gold_purity: Number(savedGoldLoan.gold_purity),
            gold_value: Number(savedGoldLoan.gold_value)
        };

        const lenders = await GoldLoanLender.find();

        const eligibleLenders = lenders.filter((lender) =>
            isGoldLoanEligibleForLender(goldLoanData, lender)
        );

        return res.status(201).json({
            message: "GOLD LOAN APPLICATION CREATED SUCCESSFULLY",
            data: savedGoldLoan,
            lendersChecked: lenders.length,
            total_matches: eligibleLenders.length,
            eligible_lenders: eligibleLenders
        });

    } catch (error) {
        return res.status(500).json({
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};
module.exports = {
    createGoldLoan,

};
