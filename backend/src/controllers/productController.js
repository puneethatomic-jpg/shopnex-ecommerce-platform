const prisma = require('../config/db');
const cache = require('../cache');

const productController = {
  getAll: async (req, res, next) => {
    try {
      const {
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        sort,
        page = 1,
        limit = 10,
      } = req.query;

      // Construct cache key based on query parameters
      const cacheKey = `products:query:${JSON.stringify({
        search,
        category,
        brand,
        minPrice,
        maxPrice,
        sort,
        page,
        limit,
      })}`;

      const cachedData = await cache.get(cacheKey);
      if (cachedData) {
        return res.status(200).json(cachedData);
      }

      // Build filters
      const where = {};

      if (search) {
        where.OR = [
          { title: { contains: search } },
          { description: { contains: search } },
        ];
      }

      if (category) {
        // Can filter by parent category or specific category
        where.category = {
          OR: [
            { slug: category },
            { parent: { slug: category } },
          ],
        };
      }

      if (brand) {
        where.brand = { name: brand };
      }

      if (minPrice || maxPrice) {
        where.price = {};
        if (minPrice) where.price.gte = parseFloat(minPrice);
        if (maxPrice) where.price.lte = parseFloat(maxPrice);
      }

      // Build sorting
      let orderBy = { createdAt: 'desc' };
      if (sort) {
        switch (sort) {
          case 'price_asc':
            orderBy = { price: 'asc' };
            break;
          case 'price_desc':
            orderBy = { price: 'desc' };
            break;
          case 'latest':
            orderBy = { createdAt: 'desc' };
            break;
          case 'popularity':
            // Order by orderItem counts or just reviews counts (fallback to reviews count)
            orderBy = { reviews: { _count: 'desc' } };
            break;
          case 'rating':
            // Order by rating average (SQLite handles this via relation counts / sorting or fallback to latest)
            orderBy = { reviews: { _count: 'desc' } };
            break;
        }
      }

      const skip = (parseInt(page) - 1) * parseInt(limit);

      const [products, total] = await prisma.$transaction([
        prisma.product.findMany({
          where,
          include: {
            images: true,
            brand: true,
            category: true,
            reviews: true,
          },
          orderBy,
          skip,
          take: parseInt(limit),
        }),
        prisma.product.count({ where }),
      ]);

      const response = {
        success: true,
        data: products,
        pagination: {
          total,
          page: parseInt(page),
          limit: parseInt(limit),
          pages: Math.ceil(total / parseInt(limit)),
        },
      };

      // Cache the response
      await cache.set(cacheKey, response, 300);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  getById: async (req, res, next) => {
    try {
      const { id } = req.params;
      const cacheKey = `product:detail:${id}`;

      const cachedProduct = await cache.get(cacheKey);
      if (cachedProduct) {
        return res.status(200).json(cachedProduct);
      }

      const product = await prisma.product.findUnique({
        where: { id },
        include: {
          images: true,
          brand: true,
          category: true,
          reviews: {
            include: {
              user: {
                select: {
                  id: true,
                  name: true,
                },
              },
            },
            orderBy: {
              createdAt: 'desc',
            },
          },
        },
      });

      if (!product) {
        return res.status(404).json({ success: false, message: 'Product not found' });
      }

      const response = {
        success: true,
        data: product,
      };

      await cache.set(cacheKey, response, 600);

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const {
        title,
        slug,
        description,
        price,
        discount,
        stock,
        brandId,
        categoryId,
        sku,
        images,
      } = req.body;

      const product = await prisma.product.create({
        data: {
          title,
          slug,
          description,
          price,
          discount,
          stock,
          brandId,
          categoryId,
          sku,
          images: {
            create: (images || []).map((url) => ({ url })),
          },
        },
      });

      // Invalidate caches
      await cache.delByPrefix('products:');

      res.status(201).json({
        success: true,
        message: 'Product created successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const {
        title,
        slug,
        description,
        price,
        discount,
        stock,
        brandId,
        categoryId,
        sku,
        images,
      } = req.body;

      // Update product details
      const updateData = {
        title,
        slug,
        description,
        price,
        discount,
        stock,
        brandId,
        categoryId,
        sku,
      };

      if (images) {
        // Simple delete old images and insert new ones
        await prisma.productImage.deleteMany({
          where: { productId: id },
        });
        updateData.images = {
          create: images.map((url) => ({ url })),
        };
      }

      const product = await prisma.product.update({
        where: { id },
        data: updateData,
      });

      // Invalidate caches
      await cache.delByPrefix('products:');
      await cache.del(`product:detail:${id}`);

      res.status(200).json({
        success: true,
        message: 'Product updated successfully',
        data: product,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      await prisma.product.delete({
        where: { id },
      });

      // Invalidate caches
      await cache.delByPrefix('products:');
      await cache.del(`product:detail:${id}`);

      res.status(200).json({
        success: true,
        message: 'Product deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = productController;
