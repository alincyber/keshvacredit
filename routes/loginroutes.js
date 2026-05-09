const express = require("express");
const { createuser } = require("../controllers/form");

const router = express.Router();

router.post("/createuser", createuser);

module.exports = router;