const express = require('express');
const AccountController = require('./controllers/AccountController');
const auth = require('./auth');

const routes = express.Router();

routes.get('/', auth, AccountController.getAllUsers);
routes.post('/register', AccountController.register);
routes.post('/login', AccountController.login);

module.exports = routes;