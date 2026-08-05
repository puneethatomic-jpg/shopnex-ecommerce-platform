const express = require('express');
const router = express.Router();
const couponController = require('../controllers/couponController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { couponSchema } = require('../validators');

// Getting coupon by code can be used by customers, listing all can be used by admins
router.get('/', auth, couponController.getAll);

// Admin-only modifying routes
router.post('/', auth, adminOnly, validate({ body: couponSchema }), couponController.create);
router.delete('/:id', auth, adminOnly, couponController.delete);

module.exports = router;
