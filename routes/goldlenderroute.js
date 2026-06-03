
const express = require("express");
const router = express.Router();
const {
    addGoldLoanLender,
    updateGoldLoanLender,
    removeGoldLoanLender,
    compareGoldLoans
} = require("../controllers/goldlendercontroller");

router.post("/add-lender", addGoldLoanLender);
router.post("/compare-live", compareGoldLoans);
router.put("/update", updateGoldLoanLender);
router.delete("/delete", removeGoldLoanLender);

module.exports = router;
