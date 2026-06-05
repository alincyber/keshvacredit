const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
    createGoldLoan,

} = require("../controllers/goldcontroller");

router.post("/add", verifyToken, createGoldLoan);


module.exports = router;
