const mongoose = require('mongoose');
const { model, Schema } = mongoose;
const contactSchema = new Schema({
    name:{type:String},
    email:{type:String},
    phone:{type:Number},
    message:{type:String}
},{versionKey:false
});
module.exports = model("Contact", contactSchema, "contacts");
