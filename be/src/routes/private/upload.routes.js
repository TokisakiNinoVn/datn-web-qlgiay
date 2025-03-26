// app.js or server.js

const express = require('express');
const router = express.Router();
const { uploadController } = require('../../controllers/index'); 

router.post('/', uploadController.uploadFile);
router.post('/file', uploadController.uploadNormal);

module.exports = router;
