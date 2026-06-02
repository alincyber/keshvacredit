const goldloanmodel = require("../model/goldloanmodel");
const goldloanlender = require("../model/goldloanlender");

const isGoldLoanEligibleForLender = (goldloan, lender) => {
    const ageok = lender.onwer_age ? Number(goldloan.owner_age) >= Number(lender.owner_age) : true;
    const loanok = lender.gold_loan_amount ? Number(goldloan.gold_loan_amount) <= Number(lender.gold_loan_amount) : true;
    const typeok = !lender.gold_type || String(lender.gold_type).toLowerCase() === String(goldloan.gold_type || "").toLowerCase();
    return ageok && loanok && typeok;
}

const addGoldLoanLender = async (req, res) => {
    try {
        const {
            
    onwer_name,
    owner_email,
    owner_phone,
    owner_pan,
    loan_amount,
    interest_rate,
    loan_purpose,
    gold_weight,
    gold_purity,
    gold_value,
    gold_form
}
        } = req.body;

        if (!onwer_name) return res.status(400).json({ message: "GOLD LOAN LENDER NAME IS REQUIRED" });
        if (loan_amount === undefined) return res.status(400).json({ message: "LOAN AMOUNT IS REQUIRED" });
        if (interest_rate === undefined) return res.status(400).json({ message: "INTEREST RATE IS REQUIRED" });
        if (gold_weight === undefined) return res.status(400).json({ message: "GOLD WEIGHT IS REQUIRED" });
        if (gold_purity === undefined) return res.status(400).json({ message: "GOLD PURITY IS REQUIRED" });
        if (gold_value === undefined) return res.status(400).json({ message: "GOLD VALUE IS REQUIRED" });
        if (gold_form === undefined) return res.status(400).json({ message: "GOLD FORM IS REQUIRED" });
        if (isNaN(loan_amount)) return res.status(400).json({ message: "LOAN AMOUNT MUST BE A NUMBER" });
        if (isNaN(interest_rate)) return res.status(400).json({ message: "INTEREST RATE MUST BE A NUMBER" });
        if (isNaN(gold_weight)) return res.status(400).json({ message: "GOLD WEIGHT MUST BE A NUMBER" });
        if (isNaN(gold_purity)) return res.status(400).json({ message: "GOLD PURITY MUST BE A NUMBER" });
        if (isNaN(gold_value)) return res.status(400).json({ message: "GOLD VALUE MUST BE A NUMBER" });

        const existingLender = await goldloanlender.findOne({ onwer_name });
        if (existingLender) {
            return res.status(409).json({ message: "GOLD LOAN LENDER PROFILE ALREADY EXISTS" });
        }

        const lender = new goldloanlender({
            onwer_name,
            owner_email,
            owner_phone,
            owner_pan,
            loan_amount,
            interest_rate,
            loan_purpose,
            gold_weight,    
            gold_purity,
            gold_value,
            gold_form
        });
        await lender.save();
        res.status(201).json({ message: "GOLD LOAN LENDER PROFILE CREATED SUCCESSFULLY" });
    } catch (error) {
        res.status(500).json({ message: "INTERNAL SERVER ERROR" });
    }
}
    const campareGoldLoans = async (req, res) => {
        try {
            const {onwer_phone} = req.body;
            if (!onwer_phone) return res.status(400).json({ message: "GOLD LOAN LENDER PHONE NUMBER IS REQUIRED" });
            const lender = await goldloanlender.findOne({ owner_phone: onwer_phone });
            if (!lender) return res.status(404).json({ message: "GOLD LOAN LENDER NOT FOUND" });
            const goldloans = await goldloanmodel.find();
            const eligibleLoans = goldloans.filter(goldloan => isGoldLoanEligibleForLender(goldloan, lender));
            res.status(200).json({ message: "GOLD LOANS COMPARED SUCCESSFULLY", data: eligibleLoans });
        } catch (error) {
            res.status(500).json({ message: "INTERNAL SERVER ERROR" });
        }
            }