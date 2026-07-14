const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const deletedUserSchema = new Schema({
    // Copy all fields from personal model
    person_name: { type: String },
    person_email: { type: String },
    person_phone: { type: String },
    person_pan: { type: String },
    person_dob: { type: Date },
    person_aadhar: { type: String },
    person_name_as_per_aadhar: { type: String },
    employment_type: { type: String },
    person_age: { type: Number },
    loan_purpose: { type: String },
    annual_income: { type: Number },
    person_location: { type: String },
    personal_loan_amount: { type: Number },
    
    // Deletion metadata
    deleteReason: { type: String },
    deleteRequestedAt: { type: Date },
    deletedAt: { type: Date, default: Date.now },
    
    // Backup of original data (for audit purposes)
    originalUserData: { type: Object }
}, { 
    versionKey: false,
    timestamps: true
});

module.exports = model("DeletedUser", deletedUserSchema, "DeletedUsers");