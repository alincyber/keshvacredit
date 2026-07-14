const express = require("express");
const router = express.Router();
const {
    createPersonalUser,
    compareUserByPhone,
    getPersonByPhone,
    updateUserByPan,
    deletePersonByPan,
    getPersonalLoans,
    getUserById,
    getPerson
} = require("../controllers/personalcontroller");
router.post("/create-user", createPersonalUser);
router.post("/compare-user", compareUserByPhone);
router.post("/get-user", getPersonByPhone);
router.put("/update-user", updateUserByPan);
router.delete("/delete-user", deletePersonByPan);
router.get("/get-all", getPerson);
// Get all personal loans (excludes pending deletion users)
router.get('/personal-loans', getPersonalLoans);

// Get user by ID (excludes pending deletion users)
router.get('/personal-loans/:id', getUserById);
module.exports = router;