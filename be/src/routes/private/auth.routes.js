const express = require('express');
const router = express.Router();
const { authentication } = require('../../controllers/index');

router.post('/logout',  authentication.logout);

module.exports = router;
