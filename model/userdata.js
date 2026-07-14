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
    state:{type:String},
    deleteRequested: {
    type: Boolean,
    default: false
},

deleteAt: {
    type: Date,
    default: null
},

deleteReason: {
    type: String,
    default: null
},

accountStatus: {
    type: String,
    enum: ['active', 'pending_deletion', 'deleted'],
    default: 'active'
},

isDeleted: {
    type: Boolean,
    default: false
}
},{versionKey:false});

module.exports=model("User",userschema);
