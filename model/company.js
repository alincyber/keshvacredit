const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const companySchema = new Schema({

    company_name: { type: String },
    min_age: { type: Number },
    max_age: { type: Number },
    min_income: { type: Number },
    max_loan: { type: Number },
    interest_rate: { type: Number },
    allowed_employment: [{ type: String }]
}, { versionKey: false });

module.exports = model("Company", companySchema, "companies");
