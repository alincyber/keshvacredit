const express = require("express");
const router = express.Router();
const {
    addPersonalUser,
    getPersonById,
    getPersonByPhone,
    comparePersonalLoans,
    updatePersonByPan,
    removePersonByPan,
    getAllPersonalUsers
} = require("../controllers/personalloanlender");
router.post("/add", addPersonalUser);
router.post("/get-by-id/:id", getPersonById);
router.post("/get-by-phone", getPersonByPhone);
router.post("/compare", comparePersonalLoans);
router.put("/update", updatePersonByPan);
router.delete("/remove", removePersonByPan);
router.get("/all", getAllPersonalUsers);

module.exports = router;