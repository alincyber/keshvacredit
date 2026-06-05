const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
    createHomeLoan,
    compareHomeLoanByPhone,
    getHomeLoanByPhone,
    updateHomeLoanByPan,
    deleteHomeLoanByPan,
    getAllHomeLoans
} = require("../controllers/homeloancontrolller");

router.post("/add", verifyToken, createHomeLoan);
router.post("/compare", verifyToken, compareHomeLoanByPhone);
router.post("/get-by-phone", verifyToken, getHomeLoanByPhone);
router.put("/update", verifyToken, updateHomeLoanByPan);
router.delete("/delete", verifyToken, deleteHomeLoanByPan);
router.get("/all", verifyToken, getAllHomeLoans);

module.exports = router;