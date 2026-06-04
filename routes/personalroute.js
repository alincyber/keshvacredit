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
router.post("/get-user", getPersonByPhone);
router.post("/update-user", updateUserByPan);
router.post("/delete-user", deletePersonByPan);
router.post("/get-all", getPerson);
// blank
module.exports = router;