const express = require("express");
const {
    createuser,
    getusers,
    updateuser,
    removeuser,
    getuserbyphone
} = require("../controllers/form");

const verifyToken = require("../middleware/auth");

const router = express.Router();

router.post("/createuser", createuser);
router.get("/users", getusers);
router.put("/updateuser", updateuser);
router.delete("/removeuser", removeuser);

// Protected Route
router.post("/getuserbyphone", getuserbyphone);

module.exports = router;