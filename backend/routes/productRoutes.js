const express = require('express');
const router = express.Router();
const {
    getProducts,
    getProductById,
    createProduct,
    updateProduct,
    deleteProduct,
    updateProductQuantity,
    addProductToInventory,
    returnProductToInventory,
    getProductHistory
} = require('../controllers/productController');

// Get all products
router.get('/', getProducts);

// Get a single product by ID
router.get('/:id', getProductById);

// Create a new product
router.post('/', createProduct);

// Update a product by ID
router.put('/:id', updateProduct);

// Delete a product by ID
router.delete('/:id', deleteProduct);

// Update product quantity by ID
router.put('/:id/quantity', updateProductQuantity);

// Add a product to inventory
router.post('/add-to-inventory', addProductToInventory);

// Return a product to inventory
router.post('/return-to-inventory/:productId', returnProductToInventory);

// Get product history by ID
router.get('/:id/history', getProductHistory);

module.exports = router;