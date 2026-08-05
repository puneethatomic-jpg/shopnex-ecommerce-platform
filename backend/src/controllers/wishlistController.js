const prisma = require('../config/db');

const wishlistController = {
  getWishlist: async (req, res, next) => {
    try {
      const wishlist = await prisma.wishlist.findMany({
        where: { userId: req.user.id },
        include: {
          product: {
            include: {
              images: true,
              brand: true,
            },
          },
        },
      });

      res.status(200).json({
        success: true,
        data: wishlist,
      });
    } catch (error) {
      next(error);
    }
  },

  addItem: async (req, res, next) => {
    try {
      const { productId } = req.body;

      if (!productId) {
        return res.status(400).json({ success: false, message: 'Product ID is required' });
      }

      // Check if item already in wishlist
      const existing = await prisma.wishlist.findUnique({
        where: {
          userId_productId: {
            userId: req.user.id,
            productId,
          },
        },
      });

      if (existing) {
        return res.status(200).json({
          success: true,
          message: 'Product already in wishlist',
          data: existing,
        });
      }

      const item = await prisma.wishlist.create({
        data: {
          userId: req.user.id,
          productId,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Product added to wishlist successfully',
        data: item,
      });
    } catch (error) {
      next(error);
    }
  },

  removeItem: async (req, res, next) => {
    try {
      const { id } = req.params; // product ID

      await prisma.wishlist.delete({
        where: {
          userId_productId: {
            userId: req.user.id,
            productId: id,
          },
        },
      });

      res.status(200).json({
        success: true,
        message: 'Product removed from wishlist successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = wishlistController;
