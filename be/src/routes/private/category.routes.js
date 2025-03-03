const express = require('express');
const router = express.Router();
const { categoryController } = require('../../controllers/index');

// router.get('/list-simple', categoryController.getListCategorysSimple);
router.get('/all', categoryController.getAllCategorys);

router.post('/add', categoryController.addCategory);
router.put('/update', categoryController.updateCategory);
router.delete('/delete/:id', categoryController.deleteCategory);

module.exports = router;
