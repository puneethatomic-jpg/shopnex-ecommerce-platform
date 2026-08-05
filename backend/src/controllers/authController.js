const prisma = require('../config/db');

const authController = {
  register: async (req, res, next) => {
    try {
      const { email, name, clerkId, phone } = req.body;

      if (!email || !clerkId || !name) {
        return res.status(400).json({ success: false, message: 'Email, name, and clerkId are required' });
      }

      // Check if user already exists
      let user = await prisma.user.findUnique({
        where: { clerkId },
      });

      if (user) {
        return res.status(400).json({ success: false, message: 'User already exists' });
      }

      user = await prisma.user.create({
        data: {
          clerkId,
          email,
          name,
          phone,
          role: 'CUSTOMER',
        },
      });

      // Initialize Cart for user
      await prisma.cart.create({
        data: {
          userId: user.id,
        },
      });

      res.status(201).json({
        success: true,
        message: 'User registered successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  login: async (req, res, next) => {
    try {
      const { clerkId } = req.body;
      const user = await prisma.user.findUnique({
        where: { clerkId: clerkId || 'mock_customer_123' },
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        message: 'Logged in successfully',
        token: `mock_${user.clerkId}`,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  logout: async (req, res, next) => {
    res.status(200).json({
      success: true,
      message: 'Logged out successfully',
    });
  },

  getMe: async (req, res, next) => {
    res.status(200).json({
      success: true,
      data: req.user,
    });
  },
};

module.exports = authController;
