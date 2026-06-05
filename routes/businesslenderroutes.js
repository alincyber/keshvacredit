const express = require("express");
const verifyToken = require("../middleware/auth");
const router = express.Router();

const {
    addBusinessLender,
    compareBusinessLoans,
    getLenderById,
    updateBusinessLender,
    removeBusinessLender
} = require("../controllers/businesslendercontroller");

router.post("/add", verifyToken, addBusinessLender);
router.post("/compare-live", verifyToken, compareBusinessLoans);
router.get("/:id", verifyToken, getLenderById);
router.put("/update", verifyToken, updateBusinessLender);
router.delete("/delete", verifyToken, removeBusinessLender);

module.exports = router;
