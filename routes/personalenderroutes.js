const express = require("express");
const router = express.Router();
const verifyToken = require("../middleware/auth");
const {
    addPersonalUser,
    getPersonById,
    getPersonByPhone,
    comparePersonalLoans,
    updatePersonByPan,
    removePersonByPan,
    getAllPersonalUsers
} = require("../controllers/personalloanlender");
router.post("/add", verifyToken, addPersonalUser);
router.post("/get-by-id/:id", verifyToken, getPersonById);
router.post("/get-by-phone", verifyToken, getPersonByPhone);
router.post("/compare", verifyToken, comparePersonalLoans);
router.put("/update", verifyToken, updatePersonByPan);
router.delete("/remove", verifyToken, removePersonByPan);
router.get("/all", verifyToken, getAllPersonalUsers);

module.exports = router;