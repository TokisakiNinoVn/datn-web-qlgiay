// user.router.js
const express = require('express');
const router = express.Router();
const { roleController } = require('../controllers/index');

router.post('/create', roleController.addRole);

router.get('/all', roleController.getAllRoles);
router.get('/a/:id', roleController.getStaffByRole);
router.get('/basic', roleController.getBasicRoleController);

router.put('/edit', roleController.editRole);

router.post('/delete', roleController.deleteRole);



module.exports = router;
