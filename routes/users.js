const express = require('express');
const router = express.Router();
verifyJwt = require('../middleware/verifyJwt');



// user want to get his profile
router.get('/',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// user want to edit his profile
router.put('/',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// someone wants to register as a user
router.post('/',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// user want to login using username and password 
router.post('/auth',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// user want to login using 3rd party provider
router.post('/auth/:provider_id',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// user want to logout
router.get('/logout',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// user wants to change password
router.post('/changePassword',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// user forgot password
router.post('/forgotPassword',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

// Admin want to delete user
router.post('/:username',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})

module.exports = router;