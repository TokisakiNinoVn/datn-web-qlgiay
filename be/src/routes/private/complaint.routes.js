// user.router.js
const express = require('express');
const router = express.Router();
const { complaintController } = require('../../controllers/index');

// Route để tất cả các complaint
router.get('/', complaintController.getAll);
router.post('/create-response', complaintController.createResponse);


module.exports = router;
