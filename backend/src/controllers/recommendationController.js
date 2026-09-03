const recommendationService = require('../services/recommendationService');

const recommendationController = {
  getUserRecommendations: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit || '4');
      const recommendations = await recommendationService.getUserRecommendations(req.user.id, limit);

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  },

  getProductRecommendations: async (req, res, next) => {
    try {
      const { id } = req.params;
      const limit = parseInt(req.query.limit || '4');
      const recommendations = await recommendationService.getProductRecommendations(id, limit);

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  },

  getTrendingRecommendations: async (req, res, next) => {
    try {
      const limit = parseInt(req.query.limit || '4');
      const recommendations = await recommendationService.getTrendingRecommendations(limit);

      res.status(200).json({
        success: true,
        data: recommendations,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = recommendationController;
