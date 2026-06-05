const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const goldloanlenderSchema = new Schema({
    lender_name: {type: String},
    lender_email: {type: String},
    lender_phone: {type: String},
    loan_amount: {type: Number},
    interest_rate: {type: Number},
    loan_purpose: {type: String},
    gold_weight: {type: Number},
    gold_purity: {type: Number},
    gold_value: {type: Number},
    gold_form: {type: String}
}, {
    versionKey: false
});
module.exports = model(
    "GoldLoanLender",
    goldloanlenderSchema,
    "goldloanlenders"
);