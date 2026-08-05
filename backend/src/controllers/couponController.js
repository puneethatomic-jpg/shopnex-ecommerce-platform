const prisma = require('../config/db');

const couponController = {
  getAll: async (req, res, next) => {
    try {
      const { code } = req.query;
      if (code) {
        const coupon = await prisma.coupon.findUnique({
          where: { code },
        });

        if (!coupon) {
          return res.status(404).json({ success: false, message: 'Coupon code not found' });
        }

        if (coupon.expiry < new Date()) {
          return res.status(400).json({ success: false, message: 'Coupon code expired' });
        }

        if (coupon.usageLimit <= 0) {
          return res.status(400).json({ success: false, message: 'Coupon code usage limit reached' });
        }

        return res.status(200).json({
          success: true,
          data: coupon,
        });
      }

      const coupons = await prisma.coupon.findMany({
        orderBy: { expiry: 'asc' },
      });

      res.status(200).json({
        success: true,
        data: coupons,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { code, discount, expiry, usageLimit } = req.body;

      const coupon = await prisma.coupon.create({
        data: {
          code,
          discount: parseFloat(discount),
          expiry: new Date(expiry),
          usageLimit: parseInt(usageLimit),
        },
      });

      res.status(201).json({
        success: true,
        message: 'Coupon created successfully',
        data: coupon,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      await prisma.coupon.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Coupon deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = couponController;
