const express = require('express');
const router = express.Router();
const { historyLoginController } = require('../controllers/index');

router.get('/all', historyLoginController.getHistoryLogin);
router.get('/statistics', historyLoginController.getInforStatistics);

module.exports = router;
