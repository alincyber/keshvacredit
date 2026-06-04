const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const homeLoanLenderSchema = new Schema({
    lender_name: { type: String},
    min_loan_amount: { type: Number},
    max_loan_amount: { type: Number},
    min_applicant_age: { type: Number},
    max_applicant_age: { type: Number },
    min_annual_income: { type: Number},
    min_property_value: { type: Number },
    property_types_accepted: { type: String},
    interest_rate: { type: Number}  
}, { versionKey: false });

module.exports = model("HomeLoanLender", homeLoanLenderSchema, "HomeLoanLenders");