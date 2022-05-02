const app      = require('express');
const auth = app.Router();
const authMiddleware = require('../middleware/validateAuth')
auth.post('/',authMiddleware,require('../controller/auth'))
module.exports = auth;