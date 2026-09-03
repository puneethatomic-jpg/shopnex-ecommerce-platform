const express = require('express');
const router = express.Router();
const recommendationController = require('../controllers/recommendationController');
const { auth } = require('../middleware/auth');

// Trending recommendations (public / unauthenticated)
router.get('/trending', recommendationController.getTrendingRecommendations);

// Product similarity & frequently bought together (public)
router.get('/product/:id', recommendationController.getProductRecommendations);

// User-personalized recommendations (requires auth)
router.get('/user', auth, recommendationController.getUserRecommendations);

module.exports = router;
