const mongoose = require ("mongoose");
const {model,Schema}=mongoose;

const userschema= new Schema({
    name:{type:String},
    phone:{type:String},
    email:{type:String},
    pan:{type:String},
    dob:{type:String},
    income:{type:String},
    loan_amount:{type:String},
    employment_type:{type:String},
    pincode:{type:String},
    city:{type:String},
    state:{type:String}
},{versionKey:false});

module.exports=model("User",userschema);