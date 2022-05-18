const app      = require('express');
const register = app.Router();
const regMiddleware = require('../middleware/validateRegistration');
register.post('/',regMiddleware,require('../controller/register'));
module.exports = register;