const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
   compareLoans,
   compareLiveLoans
} = require("../controllers/loancontroller");

router.post("/compare-live", verifyToken, compareLiveLoans);
router.get("/compare/:id", verifyToken, compareLoans);

module.exports = router;
