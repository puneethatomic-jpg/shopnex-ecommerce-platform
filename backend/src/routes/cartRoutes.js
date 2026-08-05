const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cartController');
const { auth } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { cartItemSchema } = require('../validators');

// All cart operations require authentication
router.use(auth);

router.get('/', cartController.getCart);
router.post('/', validate({ body: cartItemSchema }), cartController.addItem);
router.put('/:id', cartController.updateItem);
router.delete('/:id', cartController.removeItem);

module.exports = router;
