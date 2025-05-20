const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductcantidad,
    addProductToInventory,
    returnProductToInventory,
    getProductHistory,
    countProducts
} = require('../controllers/productController');

// Get all products
router.get('/', getProducts);

// Get the count of products
router.get('/count', countProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Create a new product
router.post('/', createProduct);

// Update a product by ID
router.put('/:id', updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

// Update product cantidad by ID
router.put('/:id/cantidad', updateProductcantidad);

// Add a product to inventory
router.post('/add-to-inventory', addProductToInventory);

// Return a product to inventory
router.post('/return-to-inventory/:productId', returnProductToInventory);

// Get product history by ID
router.get('/:id/history', getProductHistory);

module.exports = router;