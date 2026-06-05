const express = require("express");
const router = express.Router();

const {
   compareLoans,
   compareLiveLoans
} = require("../controllers/loancontroller");

router.post("/compare-live", compareLiveLoans);
router.get("/compare/:id", compareLoans);

module.exports = router;
