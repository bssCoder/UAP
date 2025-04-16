const express = require('express');
const router = express.Router();
const { getPins } = require('../controllers/website');
const auth = require('../middleware/auth');

router.get('/pins', auth, getPins);

module.exports = router;