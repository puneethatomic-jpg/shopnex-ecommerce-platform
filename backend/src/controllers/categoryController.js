const prisma = require('../config/db');
const cache = require('../cache');

const categoryController = {
  getAll: async (req, res, next) => {
    try {
      const cacheKey = 'categories:tree';
      const cachedTree = await cache.get(cacheKey);

      if (cachedTree) {
        return res.status(200).json(cachedTree);
      }

      // Fetch all categories
      const categories = await prisma.category.findMany({
        include: {
          children: true,
        },
      });

      // Construct a tree where parentId is null
      const roots = categories.filter((c) => !c.parentId);

      const buildTree = (node) => {
        return {
          id: node.id,
          name: node.name,
          slug: node.slug,
          children: categories
            .filter((c) => c.parentId === node.id)
            .map(buildTree),
        };
      };

      const categoryTree = roots.map(buildTree);

      const response = {
        success: true,
        data: categoryTree,
      };

      await cache.set(cacheKey, response, 3600); // cache for 1 hour

      res.status(200).json(response);
    } catch (error) {
      next(error);
    }
  },

  create: async (req, res, next) => {
    try {
      const { name, slug, parentId } = req.body;

      const category = await prisma.category.create({
        data: {
          name,
          slug,
          parentId,
        },
      });

      // Invalidate cache
      await cache.del('categories:tree');
      // Invalidate products cache too since products filtering depends on categories
      await cache.delByPrefix('products:');

      res.status(201).json({
        success: true,
        message: 'Category created successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  update: async (req, res, next) => {
    try {
      const { id } = req.params;
      const { name, slug, parentId } = req.body;

      const category = await prisma.category.update({
        where: { id },
        data: {
          name,
          slug,
          parentId,
        },
      });

      await cache.del('categories:tree');
      await cache.delByPrefix('products:');

      res.status(200).json({
        success: true,
        message: 'Category updated successfully',
        data: category,
      });
    } catch (error) {
      next(error);
    }
  },

  delete: async (req, res, next) => {
    try {
      const { id } = req.params;

      await prisma.category.delete({
        where: { id },
      });

      await cache.del('categories:tree');
      await cache.delByPrefix('products:');

      res.status(200).json({
        success: true,
        message: 'Category deleted successfully',
      });
    } catch (error) {
      next(error);
    }
  },
};

module.exports = categoryController;
