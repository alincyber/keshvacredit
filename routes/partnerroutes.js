const express = require("express");
const router = express.Router();
const {
    createpartnership,
    updatePartnership,
} = require("../controllers/partnercontroller");
router.post("/submit", createpartnership);

router.put("/update/phone", updatePartnership);
module.exports = router;