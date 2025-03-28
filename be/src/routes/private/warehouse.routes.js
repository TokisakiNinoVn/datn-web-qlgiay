const express = require('express');
const router = express.Router();
const { warehouseController } = require('../../controllers/index');

router.get('/list', warehouseController.getListWarehouses);
router.get('/list-simple', warehouseController.getSimpleAllWarehouses);
router.get('/details/:id', warehouseController.getWarehouseById);

router.post('/create', warehouseController.createWarehouse);
router.put('/update', warehouseController.updateWarehouse);
router.delete('/delete/:id', warehouseController.deleteWarehouse);

module.exports = router;
