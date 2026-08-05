const prisma = require('../config/db');

async function auth(req, res, next) {
  try {
    // Default to mock customer for easy browsing/testing, or override using auth headers
    let clerkId = 'mock_customer_123';

    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith('Bearer ')) {
      const token = authHeader.split(' ')[1];
      if (token.startsWith('mock_')) {
        clerkId = token;
      }
    } else if (req.headers['x-mock-user']) {
      clerkId = req.headers['x-mock-user'];
    }

    const user = await prisma.user.findUnique({
      where: { clerkId },
    });

    if (!user) {
      return res.status(401).json({
        success: false,
        message: `Unauthorized: Mock user with Clerk ID ${clerkId} not found. Please seed the database first.`,
      });
    }

    req.user = user;
    next();
  } catch (error) {
    next(error);
  }
}

function adminOnly(req, res, next) {
  if (req.user && req.user.role === 'ADMIN') {
    next();
  } else {
    res.status(403).json({
      success: false,
      message: 'Forbidden: Admin access required',
    });
  }
}

module.exports = { auth, adminOnly };
