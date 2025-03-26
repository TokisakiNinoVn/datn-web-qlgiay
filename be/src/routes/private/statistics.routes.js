const express = require('express');
const router = express.Router();
const { statisticsController } = require('../../controllers/index');

router.get('/general-info', statisticsController.getGeneralInfo);


module.exports = router;
