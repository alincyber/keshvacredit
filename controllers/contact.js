const Contact = require('../model/contactmodel');
const createcontact = async(req,res)=>{
    try{
        const{name,email,phone,message}=req.body;
        if(!name || !email || !phone || !message){
            return res.status(400).json({message:"all fields are required"});
        }
    if (phone.length !== 10) {
      return res.status(400).json({
        message: "PHONE NUMBER MUST BE 10 DIGITS"
      });
    }

    if (isNaN(phone)) {
      return res.status(400).json({
        message: "PHONE NUMBER MUST CONTAIN NUMBERS ONLY"
      });
    }

    // Email validations
    if (!email.includes("@gmail") || !email.includes(".com")) {
      return res.status(400).json({
        message: "PLEASE ENTER A VALID GMAIL ADDRESS"
      });
    }
   const contact = await Contact.create({
        name,email,phone,message
    });
    return res.status(201).json({message:"CONTACT CREATED SUCCESSFULLY",contact});
  } catch (error) {
    console.error("Error creating contact:", error);
    return res.status(500).json({ message: "INTERNAL SERVER ERROR" });
  }};
  module.exports={
    createcontact
  };
