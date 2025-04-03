const express = require('express');
const router = express.Router();
const { toggleMFA, verifyMFA } = require("../controllers/mfaController");
const Middleware= require('../middleware/auth')

router.post('/toggle',Middleware, toggleMFA);
router.post('/verify', verifyMFA);

module.exports = router;