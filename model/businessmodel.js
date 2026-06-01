const mongoose = require("mongoose");
const {model,Schema}=mongoose;

const busnessschema= new Schema({
    business_owner_name:{type:String},
    business_owner_email:{type:String},
    business_owner_phone:{type:Number},
    business_owner_pan:{type:String},
    business_ower_dob:{type:Date},
    business_pan:{type:String},
    business_name:{type:String},
    business_type:{type:String},
    business_age:{type:Number},
    business_loan_purpose:{type:String},
    annual_revenue:{type:Number},
    business_location:{type:String},
    business_loan_amount:{type:Number},
    Udyam_Registration_Number :{type:String},
    gst_number:{type:String},
    msme_registration_number:{type:String},
},{versionKey:false});  

module.exports = model("business", busnessschema, "business");
