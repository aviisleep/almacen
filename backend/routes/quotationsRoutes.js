const express = require('express');
const router = express.Router();
const { protect } = require('../middleware/authMiddleware');
const {
  getAllQuotations,
  getQuotationById,
  createQuotation,
  updateQuotation,
  deleteQuotation,
  updateQuotationStatus,
  updateQuotationProducts,
  getProductSuggestions
} = require('../controllers/quotationsController');

// Rutas públicas
router.get('/products/suggestions', getProductSuggestions);

// Rutas protegidas
router.use(protect);
router.route('/')
  .get(getAllQuotations)
  .post(createQuotation);

router.route('/:id')
  .get(getQuotationById)
  .put(updateQuotation)
  .delete(deleteQuotation);

router.put('/:id/status', updateQuotationStatus);
router.put('/:id/products', updateQuotationProducts);

module.exports = router;
