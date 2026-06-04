const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const homeLoanSchema = new Schema({
    applicant_name: { type: String},
    applicant_email: { type: String},
    applicant_phone: { type: String},
    applicant_pan: { type: String},
    applicant_aadhar: { type: String},
    applicant_dob: { type: Date},
    applicant_age: { type: Number},
    employment_type: { type: String },
    applicant_location: { type: String },
    annual_income: { type: Number},
    work_experience_years: { type: Number},
    property_type: { type: String},
    property_address: { type: String},
    property_city: { type: String},
    property_state: { type: String},
    property_pincode: { type: String},
    property_area_sqft: { type: Number},
    property_value: { type: Number},
    loan_amount_requested: { type: Number},
    loan_purpose: { type: String},
    loan_tenure_years: { type: Number},
    down_payment: { type: Number},
}, { versionKey: false });

module.exports = model("HomeLoan", homeLoanSchema, "HomeLoans");