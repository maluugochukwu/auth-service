const express = require('express');
const router = express.Router();
const productMiddleware = require('../middleware/validateProduct');
const productController = require('../controller/products');
const multer = require('multer')
const fileStorageDisk = multer.diskStorage({
    destination:(req, file, cb)=>{
        cb(null,'./uploads')
    },
    filename:(req, file, cb)=>{
        cb(null, Date.now()+'--'+file.originalname)
    }
})
const upload = multer({ storage: fileStorageDisk})


router.get('/showcase', productController.getProductShowcase)
router.post('/filtered', productController.getAllFilteredProducts)
router.get('/category/:id', productController.getProductByCategory)
router.post('/', upload.single('thumbnail') , productMiddleware,  productController.addProduct)
router.put('/:id', productMiddleware,productController.editProduct)
router.get('/search/:query',productController.searchProduct)
router.get('/details/:product_id',productController.getProductDetails)
router.post('/table_list',productController.getProductTableList)
module.exports = router;