const app      = require('express');
const refreshToken = app.Router();
const refresh = require('../controller/refreshToken')
refreshToken.post('/',refresh.refreshToken)
module.exports = refreshToken;