const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const goldschema = new Schema({
    customer_name: { type: String },
    customer_email: { type: String },
    customer_phone: { type: Number },
    customer_pan: { type: String },
    customer_dob: { type: Date },
    customer_city: { type: String },
    customer_state: { type: String },
    customer_country: { type: String },
    customer_pin_code: { type: Number },
    gold_weight: { type: Number },
    gold_purity: { type: String },
    gold_loan_amount: { type: Number },
    gold_loan_purpose: { type: String },
    customer_address: { type: String },
}, { versionKey: false });

module.exports = model("Gold", goldschema,
"goldloans");
