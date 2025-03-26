// user.router.js
const express = require('express');
const router = express.Router();
const { customerController } = require('../../controllers/index');

// Route to get all users
router.get('/all', customerController.getAllCustomer);
router.get('/users-role', customerController.getAllUsersWithRole);
router.get('/users-simple', customerController.getAllUsersSimple);
router.get('/:id', customerController.getUserById);

// Route 
router.put('/:id', customerController.updateUser);

// Delele
router.delete('/:id', customerController.deleteUser);

// Route to add a new user
router.post('/add', customerController.add);
router.post('/search', customerController.search);
router.post('/filter', customerController.filter);
router.post('/update-my-infor', customerController.updateProfile);

module.exports = router;
