const mongoose = require("mongoose");
const { model, Schema } = mongoose;

const partnershipSchema = new Schema({
    full_name: { type: String },
    contact_number: { type: String },
    email: { type: String },
    designation: { type: String },
    partner_type: { type: String,},
    business_type: { type: String},
    company_profile: { type: String },
    website: { type: String },
    products_to_refer:{type: String,},
    expected_business_volume: {type: String,},
    pincode: { type: String,},
    source_of_location: { type: String},
}, { versionKey: false });

module.exports = model("Partnership", partnershipSchema, "Partnerships");