
const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
    addGoldLoanLender,
    updateGoldLoanLender,
    removeGoldLoanLender,
    compareGoldLoans
} = require("../controllers/goldlendercontroller");

router.post("/add-lender", verifyToken, addGoldLoanLender);
router.post("/compare-live", verifyToken, compareGoldLoans);
router.put("/update", verifyToken, updateGoldLoanLender);
router.delete("/delete", verifyToken, removeGoldLoanLender);

module.exports = router;
