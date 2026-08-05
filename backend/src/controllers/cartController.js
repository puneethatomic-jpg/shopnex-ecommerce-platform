const prisma = require('../config/db');

const cartController = {
  getCart: async (req, res, next) => {
    try {
      // Find or create cart for user
      let cart = await prisma.cart.findUnique({
        where: { userId: req.user.id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                  brand: true,
                },
              },
            },
          },
        },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: req.user.id },
          include: {
            items: {
              include: {
                product: {
                  include: {
                    images: true,
                    brand: true,
                  },
                },
              },
            },
          },
        });
      }

      res.status(200).json({
        success: true,
        data: cart,
      });
    } catch (error) {
      next(error);
    }
  },

  addItem: async (req, res, next) => {
    try {
      const { productId, quantity } = req.body;

      // Find or create cart
      let cart = await prisma.cart.findUnique({
        where: { userId: req.user.id },
      });

      if (!cart) {
        cart = await prisma.cart.create({
          data: { userId: req.user.id },
        });
      }

      // Check product stock
      const product = await prisma.product.findUnique({
        where: { id: productId },
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      if (product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${product.stock} items left.`,
        });
      }

      // Check if item already in cart
      const existingItem = await prisma.cartItem.findFirst({
        where: {
          cartId: cart.id,
          productId,
        },
      });

      let cartItem;
      if (existingItem) {
        // Update quantity
        const newQty = existingItem.quantity + quantity;
        if (product.stock < newQty) {
          return res.status(400).json({
            success: false,
            message: `Cannot add more. Total in cart would exceed stock (${product.stock} items).`,
          });
        }

        cartItem = await prisma.cartItem.update({
          where: { id: existingItem.id },
          data: { quantity: newQty },
        });
      } else {
        // Create new item
        cartItem = await prisma.cartItem.create({
          data: {
            cartId: cart.id,
            productId,
            quantity,
          },
        });
      }

      res.status(200).json({
        success: true,
        message: 'Item added/updated in cart successfully',
        data: cartItem,
      });
    } catch (error) {
      next(error);
    }
  },

  updateItem: async (req, res, next) => {
    try {
      const { id } = req.params; // cartItem ID
      const { quantity } = req.body;

      const cartItem = await prisma.cartItem.findUnique({
        where: { id },
        include: { product: true },
      });

      if (!cartItem) {
        return res.status(404).json({ success: false, message: 'Cart item not found' });
      }

      if (cartItem.product.stock < quantity) {
        return res.status(400).json({
          success: false,
          message: `Insufficient stock. Only ${cartItem.product.stock} items left.`,
        });
      }

      const updated = await prisma.cartItem.update({
        where: { id },
        data: { quantity },
      });

      res.status(200).json({
        success: true,
        message: 'Cart item updated successfully',
        data: updated,
      });
    } catch (error) {
      next(error);
    }
  },

  removeItem: async (req, res, next) => {
    try {
      const { id } = req.params; // cartItem ID

      await prisma.cartItem.delete({
        where: { id },
      });

      res.status(200).json({
        success: true,
        message: 'Item removed from cart successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = cartController;
