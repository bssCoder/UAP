const express = require('express');
const router = express.Router();
const { loginUser, updateUser, forgotPassword, verifyResetOTP, resetPassword } = require("../controllers/user");
const Middleware= require('../middleware/auth')
router.post('/login', loginUser);
router.put('/update', Middleware, updateUser);
router.post('/forgot-password', forgotPassword);
router.post('/verify-otp', verifyResetOTP);
router.post('/reset-password', resetPassword);

module.exports = router;