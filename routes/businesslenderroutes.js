const express = require("express");
const router = express.Router();

const {
    addBusinessLender,
    compareBusinessLoans,
    getLenderById,
    updateBusinessLender,
    removeBusinessLender
} = require("../controllers/businesslendercontroller");

router.post("/add", addBusinessLender);
router.post("/compare-live", compareBusinessLoans);
router.get("/:id", getLenderById);
router.put("/update", updateBusinessLender);
router.delete("/delete", removeBusinessLender);

module.exports = router;
