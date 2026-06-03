const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const goldschema = new Schema({
    owner_name: { type: String },
    owner_email: { type: String },
    owner_phone: { type: String },
    owner_pan: { type: String },
    owner_age: { type: Number },
    lender_name: { type: String },
    gold_loan_amount: { type: Number },
    loan_amount: { type: Number },
    interest_rate: { type: Number },
    loan_purpose: { type: String },
    gold_weight: { type: Number },
    gold_purity: { type: Number },
    gold_value: { type: Number },
    gold_type: { type: String },
    gold_form: { type: String }
}, { timestamps: true, versionKey: false });

module.exports = model("Gold", goldschema,
"goldloans");
