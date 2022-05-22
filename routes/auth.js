const app      = require('express');
const router = app.Router();
const authMiddleware = require('../middleware/validateAuth')
const authProviderMiddleware = require('../middleware/validateAuthProvider')
const authRegistration = require('../middleware/validateRegistration')
const auth = require('../controller/auth');

// login with username and password
router.post('/',authMiddleware,auth.login)

// // login with 3rd party auth provider
// router.post('/:provider',authProviderMiddleware,require('../controller/auth'))

// // register with username, password, and other details
// router.post('/register',authRegistration,require('../controller/auth'))

// // register with 3rd party auth provider
// router.post('/register/:provider',authProviderMiddleware,require('../controller/auth'))



module.exports = router;