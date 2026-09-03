const prisma = require('../config/db');

const recommendationService = {
  // 1. Personalized User Recommendations based on Cart, Wishlist, and Order History
  getUserRecommendations: async (userId, limit = 4) => {
    const userCart = await prisma.cart.findUnique({
      where: { userId },
      include: { items: true },
    });

    const userWishlist = await prisma.wishlist.findMany({
      where: { userId },
    });

    const userOrders = await prisma.order.findMany({
      where: { userId },
      include: { items: true },
    });

    // Exclude products already in cart or ordered
    const cartProductIds = new Set(userCart?.items?.map((i) => i.productId) || []);
    const wishlistProductIds = new Set(userWishlist.map((w) => w.productId));
    const orderedProductIds = new Set(userOrders.flatMap((o) => o.items.map((i) => i.productId)));
    
    const excludedProductIds = new Set([...cartProductIds, ...orderedProductIds]);

    const seedProductIds = [...cartProductIds, ...wishlistProductIds, ...orderedProductIds];
    
    const preferredCategories = new Map();
    const preferredBrands = new Map();

    if (seedProductIds.length > 0) {
      const seedProducts = await prisma.product.findMany({
        where: { id: { in: seedProductIds } },
      });

      for (const prod of seedProducts) {
        preferredCategories.set(prod.categoryId, (preferredCategories.get(prod.categoryId) || 0) + 1);
        if (prod.brandId) {
          preferredBrands.set(prod.brandId, (preferredBrands.get(prod.brandId) || 0) + 1);
        }
      }
    }

    const candidates = await prisma.product.findMany({
      where: {
        id: { notIn: Array.from(excludedProductIds) },
        stock: { gt: 0 },
      },
      include: {
        images: true,
        brand: true,
        category: true,
        reviews: true,
      },
    });

    const scoredCandidates = candidates.map((prod) => {
      let score = 0;
      let reason = 'AI Recommended Choice';
      let matchPercentage = 85;

      // Category preference match
      const catCount = preferredCategories.get(prod.categoryId) || 0;
      if (catCount > 0) {
        score += catCount * 40;
        reason = `Based on your interest in ${prod.category?.name || 'this category'}`;
        matchPercentage += Math.min(catCount * 5, 10);
      }

      // Brand preference match
      if (prod.brandId && preferredBrands.has(prod.brandId)) {
        const brandCount = preferredBrands.get(prod.brandId);
        score += brandCount * 30;
        matchPercentage += Math.min(brandCount * 4, 8);
      }

      // Rating boost
      const avgRating = prod.reviews.length
        ? prod.reviews.reduce((acc, r) => acc + r.rating, 0) / prod.reviews.length
        : 4.5;
      score += avgRating * 10;

      // Discount boost
      if (prod.discount > 0) {
        score += 15;
      }

      return {
        ...prod,
        aiScore: score,
        aiReason: reason,
        matchPercentage: Math.min(matchPercentage, 99),
      };
    });

    scoredCandidates.sort((a, b) => b.aiScore - a.aiScore);

    return scoredCandidates.slice(0, limit);
  },

  // 2. Product-specific similarity and Frequently Bought Together
  getProductRecommendations: async (productId, limit = 4) => {
    const targetProduct = await prisma.product.findUnique({
      where: { id: productId },
      include: { category: true, brand: true },
    });

    if (!targetProduct) return [];

    const coOrders = await prisma.order.findMany({
      where: {
        items: {
          some: { productId },
        },
      },
      include: { items: true },
    });

    const coCounts = new Map();
    for (const order of coOrders) {
      for (const item of order.items) {
        if (item.productId !== productId) {
          coCounts.set(item.productId, (coCounts.get(item.productId) || 0) + 1);
        }
      }
    }

    const candidates = await prisma.product.findMany({
      where: {
        id: { not: productId },
        stock: { gt: 0 },
      },
      include: {
        images: true,
        brand: true,
        category: true,
        reviews: true,
      },
    });

    const scored = candidates.map((prod) => {
      let score = 0;
      let reason = 'AI Smart Pick';
      let matchPercentage = 80;

      const coCount = coCounts.get(prod.id) || 0;
      if (coCount > 0) {
        score += coCount * 50;
        reason = 'Frequently Bought Together';
        matchPercentage = 95;
      }

      if (prod.categoryId === targetProduct.categoryId) {
        score += 35;
        if (coCount === 0) reason = `Similar to ${targetProduct.title}`;
        matchPercentage += 10;
      }

      if (targetProduct.brandId && prod.brandId === targetProduct.brandId) {
        score += 25;
        matchPercentage += 5;
      }

      const priceDiffRatio = Math.abs(prod.price - targetProduct.price) / (targetProduct.price || 1);
      if (priceDiffRatio < 0.3) {
        score += 20;
      }

      return {
        ...prod,
        aiScore: score,
        aiReason: reason,
        matchPercentage: Math.min(matchPercentage, 98),
      };
    });

    scored.sort((a, b) => b.aiScore - a.aiScore);

    return scored.slice(0, limit);
  },

  // 3. Trending and Popularity Recommendations
  getTrendingRecommendations: async (limit = 4) => {
    const products = await prisma.product.findMany({
      where: { stock: { gt: 0 } },
      include: {
        images: true,
        brand: true,
        category: true,
        reviews: true,
        orderItems: true,
      },
    });

    const scored = products.map((prod) => {
      const salesCount = prod.orderItems.reduce((acc, i) => acc + i.quantity, 0);
      const avgRating = prod.reviews.length
        ? prod.reviews.reduce((acc, r) => acc + r.rating, 0) / prod.reviews.length
        : 4.5;

      const score = salesCount * 30 + avgRating * 20 + prod.reviews.length * 5;

      return {
        ...prod,
        aiScore: score,
        aiReason: salesCount > 0 ? `Trending — ${salesCount} sold recently` : 'Popular AI Choice',
        matchPercentage: Math.min(90 + Math.floor(avgRating * 2), 99),
      };
    });

    scored.sort((a, b) => b.aiScore - a.aiScore);

    return scored.slice(0, limit);
  },
};

module.exports = recommendationService;
