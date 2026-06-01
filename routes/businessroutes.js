const express = require("express");
const router = express.Router();

const {
  addBusinessLoan,
  getBusinessLoans,
  compareLiveBusinessLoans,
  applyBusinessWithCompany,
  getBusinessLoanById,
  updateBusinessLoan,
  removeBusinessLoan
} = require("../controllers/businesscontroller");
router.post("/add", addBusinessLoan);
router.get("/", getBusinessLoans);
router.post("/compare-live", compareLiveBusinessLoans);
router.post("/apply", applyBusinessWithCompany);
router.get("/:id", getBusinessLoanById);
router.put("/:id", updateBusinessLoan);
router.delete("/:id", removeBusinessLoan);

module.exports = router;
