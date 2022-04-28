const express = require('express');
const router = express.Router();

router.post('/', function(req, res) {
    res.json({"message":req.body.username});
})
module.exports = router;