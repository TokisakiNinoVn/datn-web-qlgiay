const express = require('express');
const router = express.Router();
const { homeController } = require('../../controllers/index');

router.get('/general-info', homeController.getGeneralInfo);


module.exports = router;
