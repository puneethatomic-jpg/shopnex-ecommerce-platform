const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { productSchema } = require('../validators');

router.get('/', productController.getAll);
router.get('/:id', productController.getById);

// Admin-only modifying routes
router.post('/', auth, adminOnly, validate({ body: productSchema }), productController.create);
router.put('/:id', auth, adminOnly, validate({ body: productSchema }), productController.update);
router.delete('/:id', auth, adminOnly, productController.delete);

module.exports = router;
