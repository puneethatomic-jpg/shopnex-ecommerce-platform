const express = require('express');
const router = express.Router();
const categoryController = require('../controllers/categoryController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { categorySchema } = require('../validators');

router.get('/', categoryController.getAll);

// Admin-only modifying routes
router.post('/', auth, adminOnly, validate({ body: categorySchema }), categoryController.create);
router.put('/:id', auth, adminOnly, validate({ body: categorySchema }), categoryController.update);
router.delete('/:id', auth, adminOnly, categoryController.delete);

module.exports = router;
