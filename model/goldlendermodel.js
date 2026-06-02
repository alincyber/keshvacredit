const mongoose = require("mongoose");
const {mondel,Schema} = mongoose;

const goldloanlenderSchema = new Schema({
    onwer_name:{type:String},
    owner_email:{type:String},
    owner_phone:{type:String},
    owner_pan:{type:String},
    loan_amount:{type:Number},
    interest_rate:{type:Number},
    loan_purpose:{type:String},
    gold_weight:{type:Number},
    gold_purity:{type:Number},
    gold_value:{type:Number},
    gold_form:{type:String}
},{timestamps:true,versionKey:false});

module.exports =mongoose.model("goldloanlender", goldloanlenderSchema," goldloanlender");
;