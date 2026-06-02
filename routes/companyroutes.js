const express = require("express");
const router = express.Router();

const {
    addCompany,
    // getCompanies,
    compareLiveLoans,
    getCompanyById,
    // applyWithPhone,
    updateCompany,
    removeCompany
} = require("../controllers/companycontroller");

router.post("/add", addCompany);
router.post("/compare-live", compareLiveLoans);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);
router.delete("/:id", removeCompany);

module.exports = router;
