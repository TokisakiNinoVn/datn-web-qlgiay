// user.router.js
const express = require('express');
const router = express.Router();
const { responseController } = require('../controllers/index');

// Route để tất cả các response
router.post('/', responseController.addResponse);


module.exports = router;
