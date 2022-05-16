const express = require('express');
const router = express.Router();
// verifyJwt = require('../middleware/verifyJwt');
const productController = require('../controller/products');

router.get('/showcase', productController.getProductShowcase)
router.get('/', productController.getAllProducts)
router.get('/category/:id', productController.getProductByCategory)
module.exports = router;