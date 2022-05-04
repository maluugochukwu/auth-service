const express = require('express');
const router = express.Router();
verifyJwt = require('../middleware/verifyJwt');

router.post('/',verifyJwt, function(req, res) {
    res.json({"message":req.body.username});
})
module.exports = router;