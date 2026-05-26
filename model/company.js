const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const companySchema = new Schema({

    company_name: { type: String },
    min_income: { type: Number },
    max_loan: { type: Number },
    interest_rate: { type: Number },
    allowed_employment: [{ type: String }],
    serviceable_states: [{ type: String }]
}, { versionKey: false });

module.exports = model("Company", companySchema);
