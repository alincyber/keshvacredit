const express = require("express");
const router = express.Router();
const { deleteUser } = require("../controllers/deleteusercontroller");

// Delete user by phone and email
router.post("/delete-user", deleteUser);

module.exports = router;
