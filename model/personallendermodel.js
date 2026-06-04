const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const personalLenderSchema = new Schema({
    lender_name: { type: String },
    min_loan_amount: { type: Number },
    max_loan_amount: { type: Number },
    min_customer_age: { type: Number},
    max_customer_age: { type: Number },
    min_monthly_income: { type: Number },
    interest_rate: { type: Number },
    allowed_loan_purposes: [{ 
        type: String,
        enum: ["Personal", "Education", "Medical", "Wedding", "Travel", "Home Renovation", "Debt Consolidation", "Other"]
    }],
    
}, { versionKey: false });

module.exports = model("PersonalLender", personalLenderSchema, "PersonalLender");
