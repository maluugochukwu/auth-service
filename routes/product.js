const express = require('express');
const router = express.Router();
// verifyJwt = require('../middleware/verifyJwt');
const productController = require('../controller/products');

router.get('/showcase', productController.getProductShowcase)
router.get('/', productController.getAllProducts)
module.exports = router;