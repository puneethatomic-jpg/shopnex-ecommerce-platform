const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database...');

  // Clean existing data
  await prisma.review.deleteMany();
  await prisma.wishlist.deleteMany();
  await prisma.cartItem.deleteMany();
  await prisma.cart.deleteMany();
  await prisma.orderItem.deleteMany();
  await prisma.order.deleteMany();
  await prisma.productImage.deleteMany();
  await prisma.product.deleteMany();
  await prisma.category.deleteMany();
  await prisma.brand.deleteMany();
  await prisma.address.deleteMany();
  await prisma.coupon.deleteMany();
  await prisma.user.deleteMany();

  // Create Users
  const admin = await prisma.user.create({
    data: {
      clerkId: 'mock_admin_123',
      name: 'ShopNex Admin',
      email: 'admin@shopnex.com',
      phone: '1234567890',
      role: 'ADMIN',
    },
  });

  const customer = await prisma.user.create({
    data: {
      clerkId: 'mock_customer_123',
      name: 'John Doe',
      email: 'customer@shopnex.com',
      phone: '0987654321',
      role: 'CUSTOMER',
    },
  });

  // Create Cart for customer
  await prisma.cart.create({
    data: {
      userId: customer.id,
    },
  });

  // Create Addresses
  await prisma.address.create({
    data: {
      userId: customer.id,
      address: '123 Main St',
      city: 'New York',
      state: 'NY',
      country: 'USA',
      zip: '10001',
    },
  });

  // Create Coupons
  await prisma.coupon.createMany({
    data: [
      {
        code: 'WELCOME10',
        discount: 10.0,
        expiry: new Date('2028-12-31'),
        usageLimit: 100,
      },
      {
        code: 'SAVE20',
        discount: 20.0,
        expiry: new Date('2028-12-31'),
        usageLimit: 50,
      },
    ],
  });

  // Create Brands
  const apple = await prisma.brand.create({ data: { name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200' } });
  const samsung = await prisma.brand.create({ data: { name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200' } });
  const nike = await prisma.brand.create({ data: { name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' } });
  const adidas = await prisma.brand.create({ data: { name: 'Adidas', logo: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=200' } });

  // Create Categories (Parent & Child)
  const electronics = await prisma.category.create({
    data: { name: 'Electronics', slug: 'electronics' },
  });
  const fashion = await prisma.category.create({
    data: { name: 'Fashion', slug: 'fashion' },
  });

  const laptops = await prisma.category.create({
    data: { name: 'Laptops', slug: 'laptops', parentId: electronics.id },
  });
  const smartphones = await prisma.category.create({
    data: { name: 'Smartphones', slug: 'smartphones', parentId: electronics.id },
  });

  const tshirts = await prisma.category.create({
    data: { name: 'T-Shirts', slug: 't-shirts', parentId: fashion.id },
  });
  const shoes = await prisma.category.create({
    data: { name: 'Shoes', slug: 'shoes', parentId: fashion.id },
  });

  // Create Products
  const macbook = await prisma.product.create({
    data: {
      title: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Supercharged by M3 Pro. Brilliant Liquid Retina XDR display, up to 22 hours of battery life, and pro-level features.',
      price: 2499.0,
      discount: 100.0,
      stock: 15,
      sku: 'MAC-M3-16',
      brandId: apple.id,
      categoryId: laptops.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
          { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800' },
        ],
      },
    },
  });

  const s24 = await prisma.product.create({
    data: {
      title: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Welcome to the era of mobile AI. With Galaxy S24 Ultra in your hands, you can unleash whole new levels of creativity.',
      price: 1299.0,
      discount: 50.0,
      stock: 25,
      sku: 'SAM-S24-ULTRA',
      brandId: samsung.id,
      categoryId: smartphones.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800' },
          { url: 'https://images.unsplash.com/photo-1598327105666-5b89351aff97?w=800' },
        ],
      },
    },
  });

  const airmax = await prisma.product.create({
    data: {
      title: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Nike\'s first lifestyle Air Max brings you style, comfort and big attitude. Features a large Air unit for lightweight cushioning.',
      price: 150.0,
      discount: 15.0,
      stock: 40,
      sku: 'NIKE-AM-270',
      brandId: nike.id,
      categoryId: shoes.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' },
        ],
      },
    },
  });

  const ultraboost = await prisma.product.create({
    data: {
      title: 'Adidas Ultraboost Light',
      slug: 'adidas-ultraboost-light',
      description: 'Experience epic energy with the new Ultraboost Light, our lightest Ultraboost ever. The magic lies in the Light BOOST midsole.',
      price: 190.0,
      discount: 0.0,
      stock: 30,
      sku: 'ADI-UB-LIGHT',
      brandId: adidas.id,
      categoryId: shoes.id,
      images: {
        create: [
          { url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800' },
        ],
      },
    },
  });

  // Create Reviews
  await prisma.review.createMany({
    data: [
      {
        userId: customer.id,
        productId: macbook.id,
        rating: 5,
        comment: 'Absolutely amazing machine! The display is stunning and it runs incredibly fast.',
      },
      {
        userId: customer.id,
        productId: s24.id,
        rating: 4,
        comment: 'Great camera and build quality. Battery life is solid, but the AI features can be a bit gimmicky.',
      },
      {
        userId: customer.id,
        productId: airmax.id,
        rating: 5,
        comment: 'Super comfortable for daily wear. Looks stylish too.',
      },
    ],
  });

  console.log('Database seeded successfully!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
