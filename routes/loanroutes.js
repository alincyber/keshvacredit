const express = require("express");
const router = express.Router();

const {
   compareLoans
} = require("../controllers/loancontroller");

router.get("/compare/:id", compareLoans);

module.exports = router;
