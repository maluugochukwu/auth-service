const app      = require('express');
const router = app.Router();
const authMiddleware = require('../middleware/validateAuth')
const authProviderMiddleware = require('../middleware/validateAuthProvider')
const authRegistration = require('../middleware/validateRegistration')
const auth = require('../controller/auth');

// login with username and password
router.post('/',authMiddleware,auth.login)

// login with 3rd party auth provider
router.post('/:provider',authProviderMiddleware,auth.loginWithProvider)

// register with username, password, and other details
router.post('/register',authRegistration,auth.login)

// register with 3rd party auth provider
router.post('/register/:provider',authProviderMiddleware,auth.login)



module.exports = router;