const express = require('express');
const router = express.Router();
const { supplierController } = require('../../controllers/index');

router.get('/list-simple', supplierController.getListSuppliersSimple);
router.get('/all', supplierController.getAllSuppliers);

router.post('/add', supplierController.addSupplier);
router.put('/update', supplierController.updateSupplier);
router.delete('/delete/:id', supplierController.deleteSupplier);

module.exports = router;
