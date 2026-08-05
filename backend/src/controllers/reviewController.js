const prisma = require('../config/db');
const cache = require('../cache');

const reviewController = {
  getByProduct: async (req, res, next) => {
    try {
      const { productId } = req.query;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'productId is required' });
      }

      const reviews = await prisma.review.findMany({
        where: { productId },
        include: {
          user: {
            select: {
              id: true,
              name: true,
            },
          },
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: reviews,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { productId, rating, comment } = req.body;

      if (!productId || !rating || !comment) {
        return res.status(400).json({ success: false, message: 'productId, rating, and comment are required' });
      }

      const review = await prisma.review.create({
        data: {
          userId: req.user.id,
          productId,
          rating: parseInt(rating),
          comment,
        },
      });

      // Invalidate product detail and product query cache since reviews and ratings are updated
      await cache.del(`product:detail:${productId}`);
      await cache.delByPrefix('products:');

      res.status(201).json({
        success: true,
        message: 'Review submitted successfully',
        data: review,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { rating, comment } = req.body;

      const existingReview = await prisma.review.findUnique({
        where: { id },
      });

      if (!existingReview) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      // User must own the review
      if (existingReview.userId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
      }

      const updated = await prisma.review.update({
        where: { id },
        data: {
          rating: rating ? parseInt(rating) : undefined,
          comment,
        },
      });

      // Invalidate cache
      await cache.del(`product:detail:${existingReview.productId}`);
      await cache.delByPrefix('products:');

      res.status(200).json({
        success: true,
        message: 'Review updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      const existingReview = await prisma.review.findUnique({
        where: { id },
      });

      if (!existingReview) {
        return res.status(404).json({ success: false, message: 'Review not found' });
      }

      // User must own review, or be an admin
      if (req.user.role !== 'ADMIN' && existingReview.userId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
      }

      await prisma.review.delete({
        where: { id },
      });

      // Invalidate cache
      await cache.del(`product:detail:${existingReview.productId}`);
      await cache.delByPrefix('products:');

      res.status(200).json({
        success: true,
        message: 'Review deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = reviewController;
