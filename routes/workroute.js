const express = require('express');
const router = express.Router();
const {
    createWorkReport,
    getWorkReportByPhone
} = require("../controllers/work");

router.post('/create', createWorkReport);
router.post('/get-by-phone', getWorkReportByPhone);

module.exports = router;