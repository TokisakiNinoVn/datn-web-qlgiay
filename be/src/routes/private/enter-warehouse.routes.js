const express = require('express');
const router = express.Router();
const { enterWarehouseController } = require('../../controllers/index');

router.post('/create', enterWarehouseController.create);

router.get('/all', enterWarehouseController.getAll);
router.get('/details/:id', enterWarehouseController.getById);

router.delete('/:id', enterWarehouseController.delete);

module.exports = router;
