
const GoldLoan = require("../model/goldloanmodel");
const GoldLoanLender = require("../model/goldlendermodel");

const isGoldLoanEligibleForLender = (goldLoan, lender) => {
    const loanOk = lender.loan_amount
        ? Number(goldLoan.gold_loan_amount) <= Number(lender.loan_amount)
        : true;

    const weightOk = lender.gold_weight
        ? Number(goldLoan.gold_weight) >= Number(lender.gold_weight)
        : true;

    const purityOk = lender.gold_purity
        ? Number(goldLoan.gold_purity) >= Number(lender.gold_purity)
        : true;

    const valueOk = lender.gold_value
        ? Number(goldLoan.gold_value) >= Number(lender.gold_value)
        : true;

    const formOk = !lender.gold_form ||
        String(lender.gold_form).toLowerCase() ===
        String(goldLoan.gold_form || "").toLowerCase();

    return loanOk && weightOk && purityOk && valueOk && formOk;
};

const addGoldLoanLender = async (req, res) => {
    try {
        const {
            lender_name,
            lender_email,
            lender_phone,
            loan_amount,
            interest_rate,
            loan_purpose,
            gold_weight,
            gold_purity,
            gold_value,
            gold_form
        } = req.body;

        if (!lender_name) {
            return res.status(400).json({
                message: "LENDER NAME IS REQUIRED"
            });
        }

        if (loan_amount === undefined) {
            return res.status(400).json({
                message: "MAXIMUM LOAN AMOUNT IS REQUIRED"
            });
        }

        if (gold_weight === undefined) {
            return res.status(400).json({
                message: "MINIMUM GOLD WEIGHT IS REQUIRED"
            });
        }

        if (gold_purity === undefined) {
            return res.status(400).json({
                message: "MINIMUM GOLD PURITY IS REQUIRED"
            });
        }

        if (gold_value === undefined) {
            return res.status(400).json({
                message: "MINIMUM GOLD VALUE IS REQUIRED"
            });
        }

        const lender = new GoldLoanLender({
            lender_name,
            lender_email,
            lender_phone,
            loan_amount,
            interest_rate,
            loan_purpose,
            gold_weight,
            gold_purity,
            gold_value,
            gold_form
        });

        await lender.save();

        return res.status(201).json({
            success: true,
            message: "GOLD LOAN LENDER ADDED SUCCESSFULLY",
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


const compareGoldLoans = async (req, res) => {
    try {
        const { owner_phone } = req.body;

        if (!owner_phone) {
            return res.status(400).json({
                message: "OWNER PHONE NUMBER IS REQUIRED"
            });
        }

        if (
            String(owner_phone).length !== 10 ||
            isNaN(owner_phone)
        ) {
            return res.status(400).json({
                message: "PHONE NUMBER MUST BE A VALID 10 DIGIT NUMBER"
            });
        }

        const goldProfile = await GoldLoan.findOne({
            owner_phone: String(owner_phone)
        });

        if (!goldProfile) {
            return res.status(404).json({
                message: "NO GOLD LOAN APPLICATION FOUND"
            });
        }

        const lenders = await GoldLoanLender.find();

        const eligibleLenders = lenders.filter((lender) =>
            isGoldLoanEligibleForLender(goldProfile, lender)
        );

        const lenderData = eligibleLenders.map((lender) => ({
            lender_name: lender.lender_name,
            lender_email: lender.lender_email,
            lender_phone: lender.lender_phone,
            interest_rate: lender.interest_rate,
            max_loan_amount: lender.loan_amount,
            required_gold_weight: lender.gold_weight,
            required_gold_purity: lender.gold_purity,
            required_gold_value: lender.gold_value,
            gold_form: lender.gold_form
        }));

        return res.status(200).json({
            success: true,
            message:
                lenderData.length > 0
                    ? "ELIGIBLE GOLD LOAN LENDERS FOUND"
                    : "NO ELIGIBLE GOLD LOAN LENDERS FOUND",
            lendersChecked: lenders.length,
            total_matches: lenderData.length,
            eligible_lenders: lenderData
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};


const updateGoldLoanLender = async (req, res) => {
    try {
        const { lender_name } = req.body;

        if (!lender_name) {
            return res.status(400).json({
                message: "LENDER NAME IS REQUIRED FOR UPDATE"
            });
        }

        const updatedLender = await GoldLoanLender.findOneAndUpdate(
            { lender_name },
            req.body,
            {
                new: true,
                runValidators: true
            }
        );

        if (!updatedLender) {
            return res.status(404).json({
                message: "LENDER NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            message: "LENDER UPDATED SUCCESSFULLY",
            data: updatedLender
        });

    } catch (error) {
        return res.status(500).json({
            success: false,
            message: "INTERNAL SERVER ERROR",
            error: error.message
        });
    }
};

const removeGoldLoanLender = async (req, res) => {
    try {
        const { lender_name } = req.body;

        if (!lender_name) {
            return res.status(400).json({
                message: "LENDER NAME IS REQUIRED FOR DELETION"
            });
        }

        const deletedLender = await GoldLoanLender.findOneAndDelete({
            lender_name
        });

        if (!deletedLender) {
            return res.status(404).json({
                message: "LENDER NOT FOUND"
            });
        }

        return res.status(200).json({
            success: true,
            message: "LENDER DELETED SUCCESSFULLY",
            deleted_lender: lender_name
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
    addGoldLoanLender,
    updateGoldLoanLender,
    removeGoldLoanLender,
    compareGoldLoans
};
