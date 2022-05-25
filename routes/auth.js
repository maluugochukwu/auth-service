const app      = require('express');
const router = app.Router();
const authMiddleware = require('../middleware/validateAuth')
const authProviderMiddleware = require('../middleware/validateAuthProvider')
const authRegistration = require('../middleware/validateRegistration')
const auth = require('../controller/auth');

// login with username and password
router.post('/',authMiddleware,auth.login)

// login or register with 3rd party auth provider
router.post('/:provider',authProviderMiddleware,auth.providerAuth)

// register with username, password, and other details
router.post('/register',authRegistration,auth.register)


// // Admin registers a user  with username, password, AND ROLE attribute
router.post('/registerUser',authRegistration,auth.register)






module.exports = router;