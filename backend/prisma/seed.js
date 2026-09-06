const { PrismaClient } = require('@prisma/client');
const prisma = new PrismaClient();

async function main() {
  console.log('Seeding database with expanded categories and products catalog...');

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

  // 1. Create Users
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
    data: { userId: customer.id },
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
      { code: 'WELCOME10', discount: 10.0, expiry: new Date('2028-12-31'), usageLimit: 100 },
      { code: 'SAVE20', discount: 20.0, expiry: new Date('2028-12-31'), usageLimit: 50 },
    ],
  });

  // 2. Create Brands
  const apple = await prisma.brand.create({ data: { name: 'Apple', logo: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=200' } });
  const samsung = await prisma.brand.create({ data: { name: 'Samsung', logo: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=200' } });
  const sony = await prisma.brand.create({ data: { name: 'Sony', logo: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=200' } });
  const bose = await prisma.brand.create({ data: { name: 'Bose', logo: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=200' } });
  const dell = await prisma.brand.create({ data: { name: 'Dell', logo: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=200' } });
  const nike = await prisma.brand.create({ data: { name: 'Nike', logo: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=200' } });
  const adidas = await prisma.brand.create({ data: { name: 'Adidas', logo: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=200' } });
  const puma = await prisma.brand.create({ data: { name: 'Puma', logo: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=200' } });
  const levis = await prisma.brand.create({ data: { name: "Levi's", logo: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=200' } });

  // 3. Create Expanded Categories & Subcategories
  // Category 1: Electronics
  const electronics = await prisma.category.create({ data: { name: 'Electronics', slug: 'electronics' } });
  const laptops = await prisma.category.create({ data: { name: 'Laptops', slug: 'laptops', parentId: electronics.id } });
  const smartphones = await prisma.category.create({ data: { name: 'Smartphones', slug: 'smartphones', parentId: electronics.id } });
  const audio = await prisma.category.create({ data: { name: 'Audio & Headphones', slug: 'audio', parentId: electronics.id } });
  const wearables = await prisma.category.create({ data: { name: 'Wearables & Smartwatches', slug: 'wearables', parentId: electronics.id } });

  // Category 2: Fashion & Apparel
  const fashion = await prisma.category.create({ data: { name: 'Fashion & Apparel', slug: 'fashion' } });
  const shoes = await prisma.category.create({ data: { name: 'Shoes & Sneakers', slug: 'shoes', parentId: fashion.id } });
  const tshirts = await prisma.category.create({ data: { name: 'T-Shirts & Tops', slug: 't-shirts', parentId: fashion.id } });
  const jackets = await prisma.category.create({ data: { name: 'Jackets & Coats', slug: 'jackets', parentId: fashion.id } });

  // Category 3: Home & Living
  const home = await prisma.category.create({ data: { name: 'Home & Living', slug: 'home-living' } });
  const appliances = await prisma.category.create({ data: { name: 'Kitchen & Appliances', slug: 'appliances', parentId: home.id } });
  const decor = await prisma.category.create({ data: { name: 'Home Decor & Lighting', slug: 'home-decor', parentId: home.id } });

  // Category 4: Gaming & Consoles
  const gaming = await prisma.category.create({ data: { name: 'Gaming & Consoles', slug: 'gaming' } });
  const consoles = await prisma.category.create({ data: { name: 'Consoles & Accessories', slug: 'consoles', parentId: gaming.id } });

  // 4. Create Products in Every Category

  // Laptops
  const macbook = await prisma.product.create({
    data: {
      title: 'MacBook Pro 16"',
      slug: 'macbook-pro-16',
      description: 'Supercharged by M3 Pro. Brilliant Liquid Retina XDR display, up to 22 hours battery life.',
      price: 2499.0, discount: 100.0, stock: 15, sku: 'MAC-M3-16', brandId: apple.id, categoryId: laptops.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' }] },
    },
  });

  const dellXps = await prisma.product.create({
    data: {
      title: 'Dell XPS 15 Laptop',
      slug: 'dell-xps-15',
      description: '15.6" 3.5K OLED Touchscreen, Intel Core i9, 32GB RAM, 1TB SSD, NVIDIA RTX 4060 graphics.',
      price: 1899.0, discount: 150.0, stock: 12, sku: 'DELL-XPS-15', brandId: dell.id, categoryId: laptops.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800' }] },
    },
  });

  // Smartphones
  const s24 = await prisma.product.create({
    data: {
      title: 'Samsung Galaxy S24 Ultra',
      slug: 'samsung-galaxy-s24-ultra',
      description: 'Era of mobile AI. 200MP camera, built-in S Pen, Snapdragon 8 Gen 3 for Galaxy.',
      price: 1299.0, discount: 50.0, stock: 25, sku: 'SAM-S24-ULTRA', brandId: samsung.id, categoryId: smartphones.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800' }] },
    },
  });

  const iphone15 = await prisma.product.create({
    data: {
      title: 'iPhone 15 Pro Max',
      slug: 'iphone-15-pro-max',
      description: 'Forged in titanium. A17 Pro chip, customizable Action button, 5x Telephoto camera.',
      price: 1199.0, discount: 0.0, stock: 20, sku: 'IPHONE-15-PRO', brandId: apple.id, categoryId: smartphones.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800' }] },
    },
  });

  // Audio & Headphones
  const boseHeadphones = await prisma.product.create({
    data: {
      title: 'Bose QuietComfort Ultra',
      slug: 'bose-quietcomfort-ultra',
      description: 'World-class noise cancellation, breakthrough spatialized audio for immersive listening.',
      price: 429.0, discount: 30.0, stock: 30, sku: 'BOSE-QC-ULTRA', brandId: bose.id, categoryId: audio.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' }] },
    },
  });

  const sonyHeadphones = await prisma.product.create({
    data: {
      title: 'Sony WH-1000XM5 Headphones',
      slug: 'sony-wh-1000xm5',
      description: 'Industry-leading noise canceling headphones with 2 processors, 8 microphones, and 30-hour battery life.',
      price: 399.0, discount: 40.0, stock: 25, sku: 'SONY-WH-XM5', brandId: sony.id, categoryId: audio.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800' }] },
    },
  });

  const airPodsMax = await prisma.product.create({
    data: {
      title: 'Apple AirPods Max',
      slug: 'apple-airpods-max',
      description: 'Apple-designed dynamic driver providing high-fidelity audio. Active Noise Cancellation with Transparency mode.',
      price: 549.0, discount: 50.0, stock: 18, sku: 'APP-AIRPODS-MAX', brandId: apple.id, categoryId: audio.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800' }] },
    },
  });

  // Wearables & Smartwatches
  const appleWatch = await prisma.product.create({
    data: {
      title: 'Apple Watch Ultra 2',
      slug: 'apple-watch-ultra-2',
      description: 'Rugged titanium case, dual-frequency GPS, up to 36 hours battery life, Double Tap gesture.',
      price: 799.0, discount: 30.0, stock: 15, sku: 'APP-WATCH-U2', brandId: apple.id, categoryId: wearables.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800' }] },
    },
  });

  const galaxyWatch = await prisma.product.create({
    data: {
      title: 'Samsung Galaxy Watch 6',
      slug: 'samsung-galaxy-watch-6',
      description: 'Advanced sleep tracking, personalized HR zones, sapphire crystal display, BIA body composition sensor.',
      price: 349.0, discount: 25.0, stock: 22, sku: 'SAM-WATCH-6', brandId: samsung.id, categoryId: wearables.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800' }] },
    },
  });

  // Shoes & Sneakers
  const airmax = await prisma.product.create({
    data: {
      title: 'Nike Air Max 270',
      slug: 'nike-air-max-270',
      description: 'Nike\'s lifestyle Air Max offering big attitude and lightweight cushioning.',
      price: 150.0, discount: 15.0, stock: 40, sku: 'NIKE-AM-270', brandId: nike.id, categoryId: shoes.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' }] },
    },
  });

  const ultraboost = await prisma.product.create({
    data: {
      title: 'Adidas Ultraboost Light',
      slug: 'adidas-ultraboost-light',
      description: 'Lightest Ultraboost ever made with responsive BOOST midsole cushioning.',
      price: 190.0, discount: 0.0, stock: 30, sku: 'ADI-UB-LIGHT', brandId: adidas.id, categoryId: shoes.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800' }] },
    },
  });

  const pumaRsx = await prisma.product.create({
    data: {
      title: 'Puma RS-X Triple Sneakers',
      slug: 'puma-rsx-triple',
      description: 'Retro-futuristic silhouette with bulky design, mesh upper, and soft cushioned RS technology.',
      price: 110.0, discount: 20.0, stock: 35, sku: 'PUMA-RSX-3', brandId: puma.id, categoryId: shoes.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800' }] },
    },
  });

  // T-Shirts & Tops
  const levisTee = await prisma.product.create({
    data: {
      title: "Levi's Classic Graphic Tee",
      slug: 'levis-classic-graphic-tee',
      description: 'Soft 100% cotton crewneck graphic t-shirt featuring iconic red tab logo.',
      price: 35.0, discount: 5.0, stock: 50, sku: 'LEV-TEE-CL', brandId: levis.id, categoryId: tshirts.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' }] },
    },
  });

  const nikeDriFit = await prisma.product.create({
    data: {
      title: 'Nike Dri-FIT Sport Top',
      slug: 'nike-drifit-sport-top',
      description: 'Moisture-wicking athletic performance t-shirt engineered for intense workouts.',
      price: 45.0, discount: 5.0, stock: 45, sku: 'NIKE-DRI-TOP', brandId: nike.id, categoryId: tshirts.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800' }] },
    },
  });

  // Jackets & Coats
  const levisJacket = await prisma.product.create({
    data: {
      title: "Levi's Denim Trucker Jacket",
      slug: 'levis-denim-trucker-jacket',
      description: 'Original denim jacket created in 1967. Standard fit, durable cotton denim fabric.',
      price: 98.0, discount: 15.0, stock: 25, sku: 'LEV-DEN-JCK', brandId: levis.id, categoryId: jackets.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800' }] },
    },
  });

  // Kitchen & Appliances
  const espressoMaker = await prisma.product.create({
    data: {
      title: 'Espresso Maker Machine Pro',
      slug: 'espresso-maker-machine-pro',
      description: '15-bar Italian pressure pump espresso machine with integrated milk steam wand.',
      price: 249.0, discount: 30.0, stock: 20, sku: 'HOME-ESP-PRO', brandId: bose.id, categoryId: appliances.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800' }] },
    },
  });

  // Home Decor & Lighting
  const deskLamp = await prisma.product.create({
    data: {
      title: 'Smart Ambient Desk Lamp',
      slug: 'smart-ambient-desk-lamp',
      description: 'RGB ambient desk lighting with wireless smartphone charging pad and touch control.',
      price: 89.0, discount: 10.0, stock: 35, sku: 'HOME-LAMP-RGB', brandId: samsung.id, categoryId: decor.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800' }] },
    },
  });

  // Gaming Consoles & Accessories
  const ps5Console = await prisma.product.create({
    data: {
      title: 'Sony PlayStation 5 Console',
      slug: 'sony-playstation-5-console',
      description: 'Experience lightning fast loading with an ultra-high speed SSD, haptic feedback, 4K gaming.',
      price: 499.0, discount: 0.0, stock: 15, sku: 'SONY-PS5-CON', brandId: sony.id, categoryId: consoles.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' }] },
    },
  });

  const ps5Controller = await prisma.product.create({
    data: {
      title: 'Sony DualSense Wireless Controller',
      slug: 'sony-dualsense-wireless-controller',
      description: 'Discover a deeper gaming experience with adaptive triggers and dynamic haptic feedback.',
      price: 69.0, discount: 10.0, stock: 40, sku: 'SONY-DS5-CTRL', brandId: sony.id, categoryId: consoles.id,
      images: { create: [{ url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800' }] },
    },
  });

  // 5. Create Sample Customer Reviews
  await prisma.review.createMany({
    data: [
      { userId: customer.id, productId: macbook.id, rating: 5, comment: 'Absolutely amazing machine! Stunning display and top speed.' },
      { userId: customer.id, productId: s24.id, rating: 4, comment: 'Great camera and build quality. Battery life is solid.' },
      { userId: customer.id, productId: airmax.id, rating: 5, comment: 'Super comfortable for daily wear.' },
      { userId: customer.id, productId: boseHeadphones.id, rating: 5, comment: 'Best noise cancellation I have ever experienced!' },
      { userId: customer.id, productId: ps5Console.id, rating: 5, comment: 'Graphics and load times are revolutionary!' },
    ],
  });

  console.log('Database successfully seeded with 4 main categories, 10 subcategories, and 20+ products!');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
