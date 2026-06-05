const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
    createbusinessman,
    getbusinessman,
    updatebusinessman
} = require("../controllers/businessmancontroller");

router.post("/createbusinessman", verifyToken, createbusinessman);
router.get("/businessmen", verifyToken, getbusinessman);
router.put("/updatebusinessman", verifyToken, updatebusinessman);

module.exports = router;
