const express = require('express');
const baysController = require('../controllers/baysController');

const router = express.Router();

// Define routes for bays
router.get('/', baysController.getAllBays);
router.get('/:id', baysController.getBayById);
router.post('/', baysController.createBay);
router.put('/:id', baysController.updateBay);
router.delete('/:id', baysController.deleteBay);

module.exports = router;