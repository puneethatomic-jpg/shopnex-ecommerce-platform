const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const { auth, adminOnly } = require('../middleware/auth');
const validate = require('../middleware/validator');
const { userUpdateSchema } = require('../validators');

router.use(auth);

// Admin-only listing of users
router.get('/', adminOnly, userController.getAll);

// Individual profile retrieval & update
router.get('/:id', userController.getById);
router.put('/:id', validate({ body: userUpdateSchema }), userController.update);

module.exports = router;
