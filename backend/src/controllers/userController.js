const prisma = require('../config/db');

const userController = {
  getAll: async (req, res, next) => {
    try {
      const users = await prisma.user.findMany({
        select: {
          id: true,
          clerkId: true,
          name: true,
          email: true,
          phone: true,
          role: true,
          createdAt: true,
        },
        orderBy: { createdAt: 'desc' },
      });

      res.status(200).json({
        success: true,
        data: users,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      if (req.user.role !== 'ADMIN' && req.user.id !== id) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
      }

      const user = await prisma.user.findUnique({
        where: { id },
        include: {
          addresses: true,
          orders: {
            orderBy: { createdAt: 'desc' },
          },
        },
      });

      if (!user) {
        return res.status(404).json({ success: false, message: 'User not found' });
      }

      res.status(200).json({
        success: true,
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, phone, addresses } = req.body;

      if (req.user.role !== 'ADMIN' && req.user.id !== id) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
      }

      const updateData = { name, phone };

      if (addresses) {
        // Simple overwrite addresses for simplicity
        await prisma.address.deleteMany({
          where: { userId: id },
        });
        updateData.addresses = {
          create: addresses.map((addr) => ({
            address: addr.address,
            city: addr.city,
            state: addr.state,
            country: addr.country,
            zip: addr.zip,
          })),
        };
      }

      const user = await prisma.user.update({
        where: { id },
        data: updateData,
        include: {
          addresses: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Profile updated successfully',
        data: user,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = userController;
