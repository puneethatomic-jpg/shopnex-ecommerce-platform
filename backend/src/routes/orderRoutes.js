const express = require('express');
const router = express.Router();
const orderController = require('../controllers/orderController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { orderSchema } = require('../validators');

router.use(auth);

router.get('/', orderController.getAll);
router.get('/:id', orderController.getById);
router.post('/', validate({ body: orderSchema }), orderController.create);

// Admin-only order status updates
router.put('/:id', adminOnly, orderController.updateStatus);

module.exports = router;
