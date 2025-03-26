const express = require('express');
const router = express.Router();
const { exportWarehouseController } = require('../../controllers/index');

router.post('/create', exportWarehouseController.create);

router.get('/export-all', exportWarehouseController.getAll);
router.get('/details/:id', exportWarehouseController.getById);

router.delete('/:id', exportWarehouseController.delete);

module.exports = router;
