const express = require('express');
const router = express.Router();
verifyJwt = require('../middleware/verifyJwt');
const userController         = require('../controller/user')
const addressController         = require('../controller/address')
const usernameCheck          = require('../middleware/checkUsernamePassword')
const midlleware          = require('../middleware/validate_user_action')


// user want to get his profile
router.get('/',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// user want to edit his profile
router.put('/',verifyJwt, userController.editProfile)

// user want to add address
router.put('/address',verifyJwt, midlleware.validateAddress,addressController.createAddress)

// user want to get info of all address
router.get('/address',verifyJwt, addressController.getAddress)

// user want to get info of an address
// router.get('/address/:address_id',verifyJwt, userController.editProfile,function(req, res) {
//     res.json({"message":req.body.username});
// })

// user want to delete an address
router.delete('/address/:address_id',verifyJwt, addressController.deleteAddress)
// user want to edit address
router.post('/address/:address_id',verifyJwt, addressController.editAddress)

// user want to see all his coupon
router.get('/coupon',verifyJwt, userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})
// user want to see all his saved wish
router.get('/wishList',verifyJwt, userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})
// user want to see all his saved items
router.delete('/wishList/:id',verifyJwt, userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})
// user want to see all his saved items
router.post('/checkout',verifyJwt, userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})
// user want to initialize payment
router.post('/initPayment',verifyJwt, userController.editProfile,function(req, res) {
    res.json({"message":req.body.username});
})


// // Admin registers a user  with username, password, AND ROLE attribute
// ???? to be moved to user route
router.post('/registerUser',verifyJwt,usernameCheck.registrationCredentialsCheck,userController.createUser)

// // user wants to change his/her password with access token
router.post('/changePassword',verifyJwt,usernameCheck.loginCredentialsCheck,userController.changePassword)


// user want to logout
router.get('/logout',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

/



// Admin want to delete user
router.post('/:username',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

module.exports = router;