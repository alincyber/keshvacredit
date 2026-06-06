const GoldLoan = require("../model/goldloanmodel");
const GoldLoanLender = require("../model/goldlendermodel");

const isGoldLoanEligibleForLender = (goldLoan, lender) => {
    const loanOk = goldLoan.gold_loan_amount <= lender.loan_amount;
    const weightOk = goldLoan.gold_weight >= lender.gold_weight;
    const purityOk = goldLoan.gold_purity >= lender.gold_purity;
    const valueOk = goldLoan.gold_value >= lender.gold_value;
    const formOk = goldLoan.gold_form === lender.gold_form;
    
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
