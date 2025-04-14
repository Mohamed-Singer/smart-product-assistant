const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');

// Get all products
router.get('/', productController.getProducts);

// Get a single product
router.get('/:id', productController.getProduct);

// Create a product
router.post('/', productController.createProduct);

// Get products by category
router.get('/category/:category', productController.getProductsByCategory);

module.exports = router; 