const mongoose = require ("mongoose");
const {model,Schema}=mongoose;

const userschema= new Schema({
    name:{type:String},
    phone:{type:String},
    email:{type:String},
    pan:{type:String},
    dob:{type:String},
    age:{type:Number},
    income:{type:Number},
    loan_amount:{type:Number},
    employment_type:{type:String},
    pincode:{type:String},
    city:{type:String},
    state:{type:String}
},{versionKey:false});

module.exports=model("User",userschema);
