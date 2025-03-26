const express = require('express');
const router = express.Router();
const { productController } = require('../../controllers/index');

router.get('/all', productController.getAllProducts);
router.get('/for-add', productController.getSimpleInfor);
router.get('/all-simple', productController.getSimpleProduct);
router.get('/details/:id', productController.getProduct);

router.post('/add', productController.addProduct);


router.put('/', productController.updateProduct);
router.delete('/:id', productController.deleteProduct);

module.exports = router;
