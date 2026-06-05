const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");

const {
    addCompany,
    // getCompanies,
    compareLiveLoans,
    getCompanyById,
    // applyWithPhone,
    updateCompany,
    removeCompany
} = require("../controllers/companycontroller");

router.post("/add", verifyToken, addCompany);
router.post("/compare-live", verifyToken, compareLiveLoans);
router.get("/:id", verifyToken, getCompanyById);
router.put("/:id", verifyToken, updateCompany);
router.delete("/:id", verifyToken, removeCompany);

module.exports = router;
