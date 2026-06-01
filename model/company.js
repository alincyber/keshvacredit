const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const companySchema = new Schema({

    company_name: { type: String },
    min_age: { type: Number },
    max_age: { type: Number },
    min_income: { type: Number },
    max_loan: { type: Number },
    interest_rate: { type: Number },
    loan_types: [{ type: String }],
    allowed_employment: [{ type: String }],
    allowed_business_types: [{ type: String }],
    min_business_age: { type: Number },
    max_business_age: { type: Number }

}, { versionKey: false });

module.exports = model("Company", companySchema, "companies");
