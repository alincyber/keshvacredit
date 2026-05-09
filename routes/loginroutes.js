const express = require("express");
const { createuser , updateuser } = require("../controllers/form");

const router = express.Router();

router.post("/createuser", createuser);
router.put("/updateuser",updateuser)

module.exports = router;

