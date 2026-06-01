const mongoose = requre("mongoose");
const {model,Schema}=mongoose;

const personalschema= new Schema({
    customer_name:{type:String},
    customer_email:{type:String},
    customer_phone:{type:Number},
    customer_pan:{type:String},
    customer_dob:{type:Date},
    customer_loan_amount:{type:Number},
    customer_loan_purpose:{type:String},
    customer_address:{type:String},
    customer_city:{type:String},
    customer_state:{type:String},
    customer_country:{type:String},
    customer_pin_code:{type:Number},
},{versionKey:false});

module.exports = model("Personal", personalschema,"Personal");