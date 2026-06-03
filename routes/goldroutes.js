const express = require("express");
const router = express.Router();

const {
    createGoldLoan,

} = require("../controllers/goldcontroller");

router.post("/add", createGoldLoan);


module.exports = router;
