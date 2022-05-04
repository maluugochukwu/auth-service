const app      = require('express');
const logout = app.Router();
logout.post('/',require('../controller/logout'))
module.exports = logout;