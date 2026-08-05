const { z } = require('zod');

const productSchema = z.object({
  title: z.string().min(2, 'Title must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  description: z.string().min(5, 'Description must be at least 5 characters'),
  price: z.number().positive('Price must be greater than 0'),
  discount: z.number().nonnegative('Discount cannot be negative').default(0),
  stock: z.number().int().nonnegative('Stock cannot be negative').default(0),
  brandId: z.string().optional().nullable(),
  categoryId: z.string().min(1, 'Category ID is required'),
  sku: z.string().min(2, 'SKU must be at least 2 characters'),
  images: z.array(z.string().url()).optional(),
});

const categorySchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  slug: z.string().min(2, 'Slug must be at least 2 characters'),
  parentId: z.string().optional().nullable(),
});

const cartItemSchema = z.object({
  productId: z.string().min(1, 'Product ID is required'),
  quantity: z.number().int().positive('Quantity must be at least 1'),
});

const orderSchema = z.object({
  addressId: z.string().optional(), // Existing address
  address: z.object({
    address: z.string().min(5, 'Address is required'),
    city: z.string().min(2, 'City is required'),
    state: z.string().min(2, 'State is required'),
    country: z.string().min(2, 'Country is required'),
    zip: z.string().min(3, 'Zip code is required'),
  }).optional(), // New address
  couponCode: z.string().optional(),
});

const reviewSchema = z.object({
  rating: z.number().int().min(1).max(5, 'Rating must be between 1 and 5'),
  comment: z.string().min(3, 'Comment must be at least 3 characters'),
});

const userUpdateSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters').optional(),
  phone: z.string().optional().nullable(),
});

const couponSchema = z.object({
  code: z.string().min(3, 'Code must be at least 3 characters'),
  discount: z.number().positive().max(100, 'Discount percentage must be <= 100'),
  expiry: z.string().datetime('Expiry must be a valid date'),
  usageLimit: z.number().int().positive('Usage limit must be at least 1'),
});

module.exports = {
  productSchema,
  categorySchema,
  cartItemSchema,
  orderSchema,
  reviewSchema,
  userUpdateSchema,
  couponSchema,
};
