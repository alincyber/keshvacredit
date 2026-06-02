const mongooose = require ("mongoose");
const {model,Schema} = mongooose;

const businesslenderSchema = new Schema({
    business_name:{type:String},
    business_type:{type:String},
    business_age:{type:Number},
    annual_revenue:{type:Number},
    business_loan_amount:{type:Number},
    business_location:{type:String},
    business_loan_purpose:{type:String},
    business_owner_name:{type:String},
    business_owner_email:{type:String},
    business_owner_phone:{type:Number},
    business_owner_pan:{type:String},
    business_pan:{type:String},
    Udyam_Registration_Number:{type:String},
    gst_number:{type:String},
    msme_registration_number:{type:String},
    business_lender_name:{type:String},
    min_age:{type:Number},
    max_age:{type:Number},
    min_income:{type:Number},
    max_loan:{type:Number},
    interest_rate:{type:Number},
    min_business_age:{type:Number},
    max_business_age:{type:Number}
},{versionKey:false
});

module.exports  = model("Businessloan",businesslenderSchema,"BusinessLender");

 
