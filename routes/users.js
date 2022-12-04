const express = require('express');
const router = express.Router();
verifyJwt = require('../middleware/verifyJwt');
const userController         = require('../controller/user')
const addressController         = require('../controller/address')
const usernameCheck          = require('../middleware/checkUsernamePassword')
const midlleware          = require('../middleware/validate_user_action')


// user want to get his profile
router.get('/',verifyJwt(["204","100"]), function(req, res) {
    res.json({"message":req.body.username});
})

// user want to edit his profile
router.put('/',verifyJwt(["204","100"]), userController.editProfile)

// user want to add address
router.put('/address',verifyJwt(["204"]), midlleware.validateAddress,addressController.createAddress)

// user want to get info of all address
router.get('/address',verifyJwt(["204"]), addressController.getAddress)

// user want to get info of an address
// router.get('/address/:address_id',verifyJwt, userController.editProfile,function(req, res) {
//     res.json({"message":req.body.username});
// })

// user want to delete an address
router.delete('/address/:address_id',verifyJwt(["204"]), addressController.deleteAddress)
// user want to edit address
router.post('/address/:address_id',verifyJwt(["204"]), addressController.editAddress)

// user want to see all his coupon
router.get('/coupon',verifyJwt(["204"]), userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})
// user want to see all his saved wish
router.get('/wishList',verifyJwt(["204"]), userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})
// user want to see all his saved items
router.delete('/wishList/:id',verifyJwt(["204"]), userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})
// user want to see all his saved items
router.post('/checkout',verifyJwt(["204"]), userController.checkout)


// user want to initialize payment
router.post('/initPayment',verifyJwt(["204"]), userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})


// // Admin registers a user  with username, password, AND ROLE attribute
// ???? to be moved to user route
router.post('/registerUser',verifyJwt(["100"]),usernameCheck.registrationCredentialsCheck,userController.createUser)

// // user wants to change his/her password with access token
router.post('/changePassword',verifyJwt(["204","100"]),usernameCheck.loginCredentialsCheck,userController.changePassword)


// user want to logout
router.get('/logout',verifyJwt(["204","100"]), function(req, res) {
    res.json({"message":req.body.username});
})

/



// Admin want to delete user
router.post('/:username',verifyJwt(["100"]), function(req, res) {
    res.json({"message":req.body.username});
})

module.exports = router;