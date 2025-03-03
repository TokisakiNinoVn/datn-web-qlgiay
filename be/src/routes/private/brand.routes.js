const express = require('express');
const router = express.Router();
const { brandController } = require('../../controllers/index');

router.get('/all', brandController.getAllBrands);

router.post('/add', brandController.addBrand);
router.put('/update', brandController.updateBrand);
router.delete('/delete/:id', brandController.deleteBrand);

module.exports = router;
