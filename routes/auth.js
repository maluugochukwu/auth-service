const app      = require('express');
const auth = app.Router();
const authMiddleware = require('../middleware/validateAuth')
const authProviderMiddleware = require('../middleware/validateAuthProvider')
const authRegistration = require('../middleware/validateRegistration')

// login with username and password
auth.post('/',authMiddleware,require('../controller/auth'))

// login with 3rd party auth provider
auth.post('/:provider',authProviderMiddleware,require('../controller/auth'))

// register with username, password, and other details
auth.post('/register',authRegistration,require('../controller/auth'))

// register with 3rd party auth provider
auth.post('/register/:provider',authProviderMiddleware,require('../controller/auth'))



module.exports = auth;