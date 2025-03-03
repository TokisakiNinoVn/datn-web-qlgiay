// user.router.js
const express = require('express');
const router = express.Router();
const { notificationController } = require('../../controllers/index');

// Route để tất cả các notification
router.get('/', notificationController.getAll);

// Route để add notification
router.post('/', notificationController.add);


module.exports = router;
