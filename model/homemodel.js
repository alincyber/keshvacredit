const mongoose = require('mongoose');
const { model, Schema } = mongoose;

const homeSchema = new Schema({
    owner_name: { type: String },
    owner_email: { type: String },
    owner_phone: { type: Number },   
    owner_pan: { type: String },
    owner_dob: { type: Date },
    home_address: { type: String },
    home_city: { type: String },
    home_state: { type: String },
    home_country: { type: String },
    home_pin_code: { type: Number },
    home_loan_amount: { type: Number },
    home_loan_purpose: { type: String },

}, { versionKey: false });

module.exports =  model("Home", homeSchema,
"homeloans");