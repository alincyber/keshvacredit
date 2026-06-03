const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const goldloanlenderSchema = new Schema({
    lender_name: {
        type: String,
        required: [true, "Lender name is required"],
        unique: true,
        trim: true,
        minlength: [3, "Lender name must be at least 3 characters"]
    },

    lender_email: {
        type: String,
        required: [true, "Lender email is required"],
        lowercase: true,
        trim: true
    },

    lender_phone: {
        type: String,
        required: [true, "Lender phone is required"],
        match: [/^[0-9]{10}$/, "Phone number must be 10 digits"]
    },

    loan_amount: {
        type: Number,
        required: [true, "Loan amount is required"],
        min: [1000, "Loan amount must be at least ₹1,000"],
        max: [10000000, "Loan amount cannot exceed ₹1,00,00,000"]
    },

    interest_rate: {
        type: Number,
        required: [true, "Interest rate is required"],
        min: [0, "Interest rate cannot be negative"],
        max: [36, "Interest rate cannot exceed 36%"]
    },

    loan_purpose: {
        type: String,
        trim: true
    },

    gold_weight: {
        type: Number,
        required: [true, "Gold weight is required"],
        min: [1, "Gold weight must be at least 1 gram"],
        max: [10000, "Gold weight cannot exceed 10,000 grams"]
    },

    gold_purity: {
        type: Number,
        required: [true, "Gold purity is required"],
        min: [9, "Gold purity must be at least 9K"],
        max: [24, "Gold purity cannot exceed 24K"]
    },

    gold_value: {
        type: Number,
        required: [true, "Gold value is required"],
        min: [1000, "Gold value must be at least ₹1,000"],
        max: [100000000, "Gold value cannot exceed ₹10,00,00,000"]
    },

    gold_form: {
        type: String,
        enum: ["jewelry", "bars", "coins", "any"],
        default: "any"
    }
}, {
    timestamps: true,
    versionKey: false
});

goldloanlenderSchema.index({ lender_name: 1 });
goldloanlenderSchema.index({ loan_amount: 1, gold_weight: 1 });

module.exports = model(
    "GoldLoanLender",
    goldloanlenderSchema,
    "goldloanlenders"
);