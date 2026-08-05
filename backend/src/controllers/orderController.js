const prisma = require('../config/db');
const mailer = require('../config/mail');
const cache = require('../cache');

const orderController = {
  getAll: async (req, res, next) => {
    try {
      let orders;
      if (req.user.role === 'ADMIN') {
        // Admins can see all orders
        orders = await prisma.order.findMany({
          include: {
            user: {
              select: {
                id: true,
                name: true,
                email: true,
              },
            },
          },
          orderBy: { createdAt: 'desc' },
        });
      } else {
        // Customers only see their own orders
        orders = await prisma.order.findMany({
          where: { userId: req.user.id },
          orderBy: { createdAt: 'desc' },
        });
      }

      res.status(200).json({
        success: true,
        data: orders,
      });
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;

      const order = await prisma.order.findUnique({
        where: { id },
        include: {
          items: {
            include: {
              product: {
                include: {
                  images: true,
                },
              },
            },
          },
          user: {
            select: {
              id: true,
              name: true,
              email: true,
            },
          },
        },
      });

      if (!order) {
        return res.status(404).json({ success: false, message: 'Order not found' });
      }

      // Check authorization
      if (req.user.role !== 'ADMIN' && order.userId !== req.user.id) {
        return res.status(403).json({ success: false, message: 'Forbidden: Access denied' });
      }

      res.status(200).json({
        success: true,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { addressId, address, couponCode } = req.body;

      // 1. Get user cart and items
      const cart = await prisma.cart.findUnique({
        where: { userId: req.user.id },
        include: {
          items: {
            include: { product: true },
          },
        },
      });

      if (!cart || cart.items.length === 0) {
        return res.status(400).json({ success: false, message: 'Cart is empty' });
      }

      // 2. Validate products stock and calculate subtotal
      let subtotal = 0;
      for (const item of cart.items) {
        if (item.product.stock < item.quantity) {
          return res.status(400).json({
            success: false,
            message: `Insufficient stock for product ${item.product.title}. Only ${item.product.stock} items left.`,
          });
        }
        const itemPrice = item.product.price - item.product.discount;
        subtotal += itemPrice * item.quantity;
      }

      // 3. Address resolution
      let shippingAddress = '';
      if (addressId) {
        const dbAddress = await prisma.address.findUnique({
          where: { id: addressId },
        });
        if (!dbAddress || dbAddress.userId !== req.user.id) {
          return res.status(400).json({ success: false, message: 'Invalid address selection' });
        }
        shippingAddress = `${dbAddress.address}, ${dbAddress.city}, ${dbAddress.state}, ${dbAddress.country} - ${dbAddress.zip}`;
      } else if (address) {
        // Create address for user
        const newAddress = await prisma.address.create({
          data: {
            userId: req.user.id,
            address: address.address,
            city: address.city,
            state: address.state,
            country: address.country,
            zip: address.zip,
          },
        });
        shippingAddress = `${newAddress.address}, ${newAddress.city}, ${newAddress.state}, ${newAddress.country} - ${newAddress.zip}`;
      } else {
        return res.status(400).json({ success: false, message: 'Shipping address is required' });
      }

      // 4. Coupon discount
      let discountAmount = 0;
      if (couponCode) {
        const coupon = await prisma.coupon.findUnique({
          where: { code: couponCode },
        });

        if (!coupon) {
          return res.status(400).json({ success: false, message: 'Invalid coupon code' });
        }

        if (coupon.expiry < new Date()) {
          return res.status(400).json({ success: false, message: 'Coupon has expired' });
        }

        if (coupon.usageLimit <= 0) {
          return res.status(400).json({ success: false, message: 'Coupon usage limit reached' });
        }

        // Apply discount percentage
        discountAmount = (subtotal * coupon.discount) / 100;

        // Decrement coupon limit
        await prisma.coupon.update({
          where: { id: coupon.id },
          data: { usageLimit: coupon.usageLimit - 1 },
        });
      }

      const shippingFee = subtotal > 500 ? 0 : 15.0;
      const tax = (subtotal - discountAmount) * 0.08; // 8% tax
      const total = subtotal - discountAmount + shippingFee + tax;

      // 5. Create order and update stock in a single transaction
      const order = await prisma.$transaction(async (tx) => {
        // Create Order
        const newOrder = await tx.order.create({
          data: {
            userId: req.user.id,
            status: 'PENDING',
            total,
            shippingFee,
            tax,
            items: {
              create: cart.items.map((item) => ({
                productId: item.productId,
                quantity: item.quantity,
                price: item.product.price - item.product.discount,
              })),
            },
          },
        });

        // Deduct Product Stock
        for (const item of cart.items) {
          await tx.product.update({
            where: { id: item.productId },
            data: { stock: item.product.stock - item.quantity },
          });
        }

        // Clear Cart
        await tx.cartItem.deleteMany({
          where: { cartId: cart.id },
        });

        return newOrder;
      });

      // Invalidate products cache (due to stock updates)
      await cache.delByPrefix('products:');

      // 6. Send order placed email notification (mock or smtp)
      await mailer.sendMail({
        to: req.user.email,
        subject: `ShopNex Order Confirmation - Order #${order.id.slice(0, 8)}`,
        text: `Hello ${req.user.name},\n\nThank you for your order! Your order total is $${total.toFixed(2)}. It will be shipped to: ${shippingAddress}.\n\nOrder Status: PENDING.\n\nBest regards,\nShopNex Team`,
      });

      res.status(201).json({
        success: true,
        message: 'Order created successfully',
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },

  updateStatus: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { status } = req.body;

      const validStatuses = ['PENDING', 'PROCESSING', 'SHIPPED', 'DELIVERED', 'CANCELLED', 'RETURNED'];
      if (!validStatuses.includes(status)) {
        return res.status(400).json({ success: false, message: 'Invalid order status' });
      }

      const order = await prisma.order.update({
        where: { id },
        data: { status },
        include: { user: true },
      });

      // Send status update notification email
      await mailer.sendMail({
        to: order.user.email,
        subject: `ShopNex Order #${order.id.slice(0, 8)} Status Update: ${status}`,
        text: `Hello ${order.user.name},\n\nYour order status has been updated to: ${status}.\n\nThank you for shopping with us!\nShopNex Team`,
      });

      res.status(200).json({
        success: true,
        message: `Order status updated to ${status} successfully`,
        data: order,
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = orderController;
