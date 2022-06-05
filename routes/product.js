const express = require('express');
const router = express.Router();
const productMiddleware = require('../middleware/validateProduct');
const productController = require('../controller/products');

router.get('/showcase', productController.getProductShowcase)
router.post('/filtered', productController.getAllFilteredProducts)
router.get('/category/:id', productController.getProductByCategory)
router.put('/', productMiddleware,productController.addProduct)
router.put('/:id', productMiddleware,productController.editProduct)
router.get('/search/:query',productController.searchProduct)
router.get('/details/:product_id',productController.searchProduct)
module.exports = router;