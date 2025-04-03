const express = require('express');
const router = express.Router();
const { login, createUser, getUsers, deleteUser } = require('../controllers/admin');
const Middleware= require('../middleware/admin')

router.post('/login', login);
router.post('/create-users',Middleware, createUser);
router.get('/get-users',Middleware, getUsers);
router.delete('/delete-users/:id',Middleware, deleteUser);

module.exports = router;