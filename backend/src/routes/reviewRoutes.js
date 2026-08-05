const express = require('express');
const router = express.Router();
const reviewController = require('../controllers/reviewController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { reviewSchema } = require('../validators');

router.get('/', reviewController.getByProduct);

// Authenticated customer reviews management
router.post('/', auth, validate({ body: reviewSchema }), reviewController.create);
router.put('/:id', auth, validate({ body: reviewSchema }), reviewController.update);
router.delete('/:id', auth, reviewController.delete);

module.exports = router;
