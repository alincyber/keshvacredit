const express = require("express");
const { createuser , updateuser , removeuser } = require("../controllers/form");

const router = express.Router();

router.post("/createuser", createuser);
router.put("/updateuser",updateuser);
router.delete("/removeuser", removeuser)

module.exports = router;

