const express = require("express");
const router = express.Router();


const {
    createbusinessman,
    getbusinessman,
    updatebusinessman,
    getBusinessByPhone
} = require("../controllers/businessmancontroller");

router.post("/createbusinessman", createbusinessman);
router.get("/businessmen", getbusinessman);
router.put("/updatebusinessman", updatebusinessman);
router.get("/get-by-phone", getBusinessByPhone); 

module.exports = router;
