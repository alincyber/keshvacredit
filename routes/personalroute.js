const express = require("express");
const router = express.Router();
const {
    createPersonalUser,
    compareUserByPhone,
    getPersonByPhone,
    updateUserByPan,
    deletePersonByPan,
    getPerson
} = require("../controllers/personalcontroller");

router.post("/create-user", createPersonalUser);
router.post("/compare-user", compareUserByPhone);
router.get("/get-user", getPersonByPhone);
router.put("/update-user", updateUserByPan);
router.delete("/delete-user", deletePersonByPan);
router.get("/get-all", getPerson);
module.exports = router;