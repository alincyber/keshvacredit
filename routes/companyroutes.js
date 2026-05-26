const express = require("express");
const router = express.Router();

const {
    addCompany,
    getCompanies,
    getCompanyById,
    updateCompany,
    removeCompany
} = require("../controllers/companycontroller");

router.post("/add", addCompany);
router.get("/", getCompanies);
router.get("/:id", getCompanyById);
router.put("/:id", updateCompany);
router.delete("/:id", removeCompany);

module.exports = router;
