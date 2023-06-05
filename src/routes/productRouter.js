const express = require('express');
const productController = require('../controllers/productController');
const upload = require('../middlewares/upload');

const router = express.Router();

router.get('/', productController.getProducts);
router.get('/:pid', productController.getProductById);
router.post('/', upload.single('thumbnails'), productController.createProduct);
router.put('/:pid', upload.single('thumbnails'), productController.updateProduct);
router.delete('/:pid', productController.deleteProduct);

module.exports = router;
