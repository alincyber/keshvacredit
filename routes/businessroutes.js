const express = require("express");
const router = express.Router();


const {
    createbusinessman,
    getbusinessman,
    updatebusinessman
} = require("../controllers/businessmancontroller");

router.post("/createbusinessman", createbusinessman);
router.get("/businessmen", getbusinessman);
router.put("/updatebusinessman", updatebusinessman);

module.exports = router;
