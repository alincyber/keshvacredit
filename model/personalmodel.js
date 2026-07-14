const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const personalSchema = new Schema({
    // Existing fields
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
    
    // Deletion-related fields
    deleteRequested: {
        type: Boolean,
        default: false,
    },
    deleteReason: {
        type: String,
        default: null,
    },
    deleteRequestedAt: {
        type: Date,
        default: null,
    },
    deleteAt: {
        type: Date,
        default: null,
    },
    accountStatus: {
        type: String,
        enum: ['active', 'pending_deletion', 'deleted'],
        default: 'active'
    },
    isDeleted: {
        type: Boolean,
        default: false,
    }
}, { 
    versionKey: false,
    timestamps: true
});

// Create indexes for better query performance
personalSchema.index({ deleteAt: 1, accountStatus: 1 });
personalSchema.index({ deleteRequested: 1, accountStatus: 1 });

module.exports = model("Personal", personalSchema, "Personal");