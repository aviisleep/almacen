const express = require('express');
const router = express.Router();
const {
  createQuotation,
  getAllQuotations,
  getQuotationById,
  updateQuotation,
  deleteQuotation,
  getProductSuggestions
} = require('../controllers/quotationController');

router.post('/', createQuotation);
router.get('/', getAllQuotations);
router.get('/:id', getQuotationById);
router.put('/:id', updateQuotation);
router.delete('/:id', deleteQuotation);
router.get('/product-suggestions/:query', getProductSuggestions);

module.exports = router;
