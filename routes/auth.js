const app                       = require('express');
const router                    = app.Router();
const authMiddleware            = require('../middleware/validateAuth')
const authProviderMiddleware    = require('../middleware/validateAuthProvider')
const authRegistration          = require('../middleware/validateRegistration')
const usernameCheck          = require('../middleware/checkUsernamePassword')
const auth                      = require('../controller/auth');

// login with username and password
router.post('/',authMiddleware,usernameCheck.loginCredentialsCheck,auth.login)

// login or register with 3rd party auth provider
router.post('/provider/:provider',authProviderMiddleware,auth.providerAuth)

// register with username, password, and other details
router.post('/register',authRegistration,auth.register)



// // user clicked on the send forgot password link
router.get('/sendForgotPasswordLink/:username',auth.forgotPassword)


// // user clicked resend verification code
router.get('/resendVerificationCode/:username',auth.resendEmailVerificationCode)

// // system is confirming verification code entered
router.get('/confirmVerificationCode/:username/:code',auth.confirmVerificationCode)

// // user wants to change his/her password. payload shall be the link that was sent to email and the password that is set
router.post('/setForgotPassword',auth.setPasswordWithLink)






module.exports = router;