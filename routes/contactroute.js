const express = require("express");
const router = express.Router()
const{
    createcontact
}= require("../controllers/contact");

router.post("/usercontact",createcontact);
module.exports=router;