const express = require('express');
const router = express.Router();
const { deleteUser, cancelDeletionRequest } = require('../controllers/deleteusercontroller');

// Route to request account deletion (48 hours delay)
router.post('/delete-account', deleteUser);

// Route to cancel deletion request
router.post('/cancel-deletion', cancelDeletionRequest);

module.exports = router;