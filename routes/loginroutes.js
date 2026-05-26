const express = require("express");
const { createuser , getusers, updateuser , removeuser } = require("../controllers/form");

const router = express.Router();

router.post("/createuser", createuser);
router.get("/users", getusers);
router.put("/updateuser",updateuser);
router.delete("/removeuser", removeuser)

module.exports = router;

