const express = require("express");
const router = express.Router();
const {
    createHomeLoan,
    compareHomeLoanByPhone,
    getHomeLoanByPhone,
    updateHomeLoanByPan,
    deleteHomeLoanByPan,
    getAllHomeLoans
} = require("../controllers/homeloancontrolller");

router.post("/add", createHomeLoan);
router.post("/compare", compareHomeLoanByPhone);
router.post("/get-by-phone", getHomeLoanByPhone);
router.put("/update", updateHomeLoanByPan);
router.delete("/delete", deleteHomeLoanByPan);
router.get("/all", getAllHomeLoans);

module.exports = router;