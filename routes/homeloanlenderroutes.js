const express = require("express");
const router = express.Router();
const {
    addHomeLoanLender,
    getAllHomeLoanLenders,
    updateHomeLoanLender,
    deleteHomeLoanLender
} = require("../controllers/homeloanlendercontroller");

router.post("/add", addHomeLoanLender);
router.get("/all", getAllHomeLoanLenders);
router.put("/update", updateHomeLoanLender);
router.delete("/delete", deleteHomeLoanLender);

module.exports = router;