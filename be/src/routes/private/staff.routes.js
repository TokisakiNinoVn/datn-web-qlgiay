// user.router.js
const express = require('express');
const router = express.Router();
const { staffController } = require('../../controllers/index');

router.get('/basic', staffController.getAllStaffBasic);
router.get('/all', staffController.getAllStaff);

router.get('/:id', staffController.getStaffById);

router.put('/:id', staffController.update);

router.post('/:id', staffController.delete);
router.post('/freeze/:id', staffController.freeze);

router.post('/add', staffController.add);

// router.post('/search', staffController.search);

// router.post('/filter', staffController.filter);

module.exports = router;
