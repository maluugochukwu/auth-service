const app      = require('express');
const refreshToken = app.Router();
refreshToken.post('/',require('../controller/refreshToken'))
module.exports = refreshToken;