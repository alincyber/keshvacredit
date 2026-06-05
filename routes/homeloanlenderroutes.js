const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
    addHomeLoanLender,
    getAllHomeLoanLenders,
    updateHomeLoanLender,
    deleteHomeLoanLender
} = require("../controllers/homeloanlendercontroller");

router.post("/add", verifyToken, addHomeLoanLender);
router.get("/all", verifyToken, getAllHomeLoanLenders);
router.put("/update", verifyToken, updateHomeLoanLender);
router.delete("/delete", verifyToken, deleteHomeLoanLender);

module.exports = router;