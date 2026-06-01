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
// router.get("/", getCompanies);
router.post("/compare-live", compareLiveLoans);
// router.post("/apply-with-phone", applyWithPhone);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);
router.delete("/:id", removeCompany);

module.exports = router;
