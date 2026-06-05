const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
    createPersonalUser,
    compareUserByPhone,
    getPersonByPhone,
    updateUserByPan,
    deletePersonByPan,
    getPerson
} = require("../controllers/personalcontroller");

router.post("/create-user", verifyToken, createPersonalUser);
router.post("/compare-user", verifyToken, compareUserByPhone);
router.post("/get-user", verifyToken, getPersonByPhone);
router.post("/update-user", verifyToken, updateUserByPan);
router.post("/delete-user", verifyToken, deletePersonByPan);
router.post("/get-all", verifyToken, getPerson);
// blank
module.exports = router;