const app      = require('express');
const auth = app.Router();
const authMiddleware = require('../middleware/validateAuth')
const authProviderMiddleware = require('../middleware/validateAuthProvider')


auth.post('/',authMiddleware,require('../controller/auth'))
auth.post('/:provider',authProviderMiddleware,require('../controller/auth'))
module.exports = auth;