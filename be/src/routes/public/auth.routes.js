const express = require('express');
const router = express.Router();
const { authentication, customerController } = require('../../controllers/index');

router.post('/login',  authentication.login);
router.post('/logout', authentication.logout);
router.post('/get-otp', customerController.getOtp);
router.post('/verify-otp', customerController.verifyOtp);
router.post('/reset-password', customerController.resetPassword);

module.exports = router;
