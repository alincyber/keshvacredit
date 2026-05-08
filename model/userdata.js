const mongoose = require ("mongoose");
const {model,Schema}=mongoose;

const userschema= new Schema({
    name:{type:String},
    phone:{type:String},
    email:{type:String}
},{versionKey:false});

module.exports=model("User",userschema);