// Complete fallback dataset matching the seeded ShopNex catalog
// Ensures 100% product visibility even during backend cold starts, mobile offline, or network delays.

export const FALLBACK_CATEGORIES = [
  {
    id: 'cat-electronics',
    name: 'Electronics',
    slug: 'electronics',
    children: [
      { id: 'cat-laptops', name: 'Laptops', slug: 'laptops' },
      { id: 'cat-smartphones', name: 'Smartphones', slug: 'smartphones' },
      { id: 'cat-audio', name: 'Audio & Headphones', slug: 'audio' },
      { id: 'cat-wearables', name: 'Wearables & Smartwatches', slug: 'wearables' },
    ],
  },
  {
    id: 'cat-fashion',
    name: 'Fashion & Apparel',
    slug: 'fashion',
    children: [
      { id: 'cat-shoes', name: 'Shoes & Sneakers', slug: 'shoes' },
      { id: 'cat-tshirts', name: 'T-Shirts & Tops', slug: 't-shirts' },
      { id: 'cat-jackets', name: 'Jackets & Coats', slug: 'jackets' },
    ],
  },
  {
    id: 'cat-home',
    name: 'Home & Living',
    slug: 'home-living',
    children: [
      { id: 'cat-appliances', name: 'Kitchen & Appliances', slug: 'appliances' },
      { id: 'cat-decor', name: 'Home Decor & Lighting', slug: 'home-decor' },
    ],
  },
  {
    id: 'cat-gaming',
    name: 'Gaming & Consoles',
    slug: 'gaming',
    children: [
      { id: 'cat-consoles', name: 'Consoles & Accessories', slug: 'consoles' },
    ],
  },
];

export const FALLBACK_PRODUCTS = [
  {
    id: 'prod-macbook',
    title: 'MacBook Pro 16"',
    slug: 'macbook-pro-16',
    description: 'Supercharged by M3 Pro. Brilliant Liquid Retina XDR display, up to 22 hours battery life.',
    price: 2499.0,
    discount: 100.0,
    stock: 15,
    sku: 'MAC-M3-16',
    brand: { name: 'Apple' },
    categoryId: 'cat-laptops',
    category: { name: 'Laptops', slug: 'laptops' },
    images: [
      { url: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=800' },
      { url: 'https://images.unsplash.com/photo-1611186871348-b1ce696e52c9?w=800' }
    ],
    reviews: [
      { id: 'rev-1', rating: 5, comment: 'Absolutely amazing machine! Stunning display and top speed.', user: { name: 'John Doe' }, createdAt: '2026-09-15' }
    ],
  },
  {
    id: 'prod-dell-xps',
    title: 'Dell XPS 15 Laptop',
    slug: 'dell-xps-15',
    description: '15.6" 3.5K OLED Touchscreen, Intel Core i9, 32GB RAM, 1TB SSD, NVIDIA RTX 4060 graphics.',
    price: 1899.0,
    discount: 150.0,
    stock: 12,
    sku: 'DELL-XPS-15',
    brand: { name: 'Dell' },
    categoryId: 'cat-laptops',
    category: { name: 'Laptops', slug: 'laptops' },
    images: [
      { url: 'https://images.unsplash.com/photo-1593642632823-8f785ba67e45?w=800' }
    ],
    reviews: [
      { id: 'rev-2', rating: 5, comment: 'Crisp OLED screen and powerful internals for video editing.', user: { name: 'Alex M.' }, createdAt: '2026-09-18' }
    ],
  },
  {
    id: 'prod-s24-ultra',
    title: 'Samsung Galaxy S24 Ultra',
    slug: 'samsung-galaxy-s24-ultra',
    description: 'Era of mobile AI. 200MP camera, built-in S Pen, Snapdragon 8 Gen 3 for Galaxy.',
    price: 1299.0,
    discount: 50.0,
    stock: 25,
    sku: 'SAM-S24-ULTRA',
    brand: { name: 'Samsung' },
    categoryId: 'cat-smartphones',
    category: { name: 'Smartphones', slug: 'smartphones' },
    images: [
      { url: 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=800' }
    ],
    reviews: [
      { id: 'rev-3', rating: 4, comment: 'Great camera and build quality. Battery life is solid.', user: { name: 'Sarah K.' }, createdAt: '2026-09-20' }
    ],
  },
  {
    id: 'prod-iphone-15',
    title: 'iPhone 15 Pro Max',
    slug: 'iphone-15-pro-max',
    description: 'Forged in titanium. A17 Pro chip, customizable Action button, 5x Telephoto camera.',
    price: 1199.0,
    discount: 0.0,
    stock: 20,
    sku: 'IPHONE-15-PRO',
    brand: { name: 'Apple' },
    categoryId: 'cat-smartphones',
    category: { name: 'Smartphones', slug: 'smartphones' },
    images: [
      { url: 'https://images.unsplash.com/photo-1592899677977-9c10ca588bbd?w=800' }
    ],
    reviews: [
      { id: 'rev-4', rating: 5, comment: 'Lightweight titanium feel is incredible compared to previous models.', user: { name: 'David L.' }, createdAt: '2026-09-21' }
    ],
  },
  {
    id: 'prod-bose-qc',
    title: 'Bose QuietComfort Ultra',
    slug: 'bose-quietcomfort-ultra',
    description: 'World-class noise cancellation, breakthrough spatialized audio for immersive listening.',
    price: 429.0,
    discount: 30.0,
    stock: 30,
    sku: 'BOSE-QC-ULTRA',
    brand: { name: 'Bose' },
    categoryId: 'cat-audio',
    category: { name: 'Audio & Headphones', slug: 'audio' },
    images: [
      { url: 'https://images.unsplash.com/photo-1505740420928-5e560c06d30e?w=800' }
    ],
    reviews: [
      { id: 'rev-5', rating: 5, comment: 'Best noise cancellation I have ever experienced!', user: { name: 'Emily W.' }, createdAt: '2026-09-22' }
    ],
  },
  {
    id: 'prod-sony-xm5',
    title: 'Sony WH-1000XM5 Headphones',
    slug: 'sony-wh-1000xm5',
    description: 'Industry-leading noise canceling headphones with 2 processors, 8 microphones, and 30-hour battery life.',
    price: 399.0,
    discount: 40.0,
    stock: 25,
    sku: 'SONY-WH-XM5',
    brand: { name: 'Sony' },
    categoryId: 'cat-audio',
    category: { name: 'Audio & Headphones', slug: 'audio' },
    images: [
      { url: 'https://images.unsplash.com/photo-1546435770-a3e426bf472b?w=800' }
    ],
    reviews: [
      { id: 'rev-6', rating: 5, comment: 'Unbeatable sound clarity and mic quality on calls.', user: { name: 'Michael T.' }, createdAt: '2026-09-23' }
    ],
  },
  {
    id: 'prod-airpods-max',
    title: 'Apple AirPods Max',
    slug: 'apple-airpods-max',
    description: 'Apple-designed dynamic driver providing high-fidelity audio. Active Noise Cancellation with Transparency mode.',
    price: 549.0,
    discount: 50.0,
    stock: 18,
    sku: 'APP-AIRPODS-MAX',
    brand: { name: 'Apple' },
    categoryId: 'cat-audio',
    category: { name: 'Audio & Headphones', slug: 'audio' },
    images: [
      { url: 'https://images.unsplash.com/photo-1583394838336-acd977736f90?w=800' }
    ],
    reviews: [
      { id: 'rev-7', rating: 5, comment: 'Premium metallic build and seamless ecosystem connectivity.', user: { name: 'Brian C.' }, createdAt: '2026-09-24' }
    ],
  },
  {
    id: 'prod-watch-ultra',
    title: 'Apple Watch Ultra 2',
    slug: 'apple-watch-ultra-2',
    description: 'Rugged titanium case, dual-frequency GPS, up to 36 hours battery life, Double Tap gesture.',
    price: 799.0,
    discount: 30.0,
    stock: 15,
    sku: 'APP-WATCH-U2',
    brand: { name: 'Apple' },
    categoryId: 'cat-wearables',
    category: { name: 'Wearables & Smartwatches', slug: 'wearables' },
    images: [
      { url: 'https://images.unsplash.com/photo-1508685096489-7aacd43bd3b1?w=800' }
    ],
    reviews: [
      { id: 'rev-8', rating: 5, comment: 'Incredible for scuba diving and ultra marathon runs.', user: { name: 'Chris P.' }, createdAt: '2026-09-25' }
    ],
  },
  {
    id: 'prod-galaxy-watch',
    title: 'Samsung Galaxy Watch 6',
    slug: 'samsung-galaxy-watch-6',
    description: 'Advanced sleep tracking, personalized HR zones, sapphire crystal display, BIA body composition sensor.',
    price: 349.0,
    discount: 25.0,
    stock: 22,
    sku: 'SAM-WATCH-6',
    brand: { name: 'Samsung' },
    categoryId: 'cat-wearables',
    category: { name: 'Wearables & Smartwatches', slug: 'wearables' },
    images: [
      { url: 'https://images.unsplash.com/photo-1579586337278-3befd40fd17a?w=800' }
    ],
    reviews: [
      { id: 'rev-9', rating: 4, comment: 'Accurate sleep coach and lightweight fit.', user: { name: 'Lisa R.' }, createdAt: '2026-09-26' }
    ],
  },
  {
    id: 'prod-airmax-270',
    title: 'Nike Air Max 270',
    slug: 'nike-air-max-270',
    description: "Nike's lifestyle Air Max offering big attitude and lightweight cushioning.",
    price: 150.0,
    discount: 15.0,
    stock: 40,
    sku: 'NIKE-AM-270',
    brand: { name: 'Nike' },
    categoryId: 'cat-shoes',
    category: { name: 'Shoes & Sneakers', slug: 'shoes' },
    images: [
      { url: 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800' }
    ],
    reviews: [
      { id: 'rev-10', rating: 5, comment: 'Super comfortable for daily wear.', user: { name: 'John Doe' }, createdAt: '2026-09-17' }
    ],
  },
  {
    id: 'prod-ultraboost',
    title: 'Adidas Ultraboost Light',
    slug: 'adidas-ultraboost-light',
    description: 'Lightest Ultraboost ever made with responsive BOOST midsole cushioning.',
    price: 190.0,
    discount: 0.0,
    stock: 30,
    sku: 'ADI-UB-LIGHT',
    brand: { name: 'Adidas' },
    categoryId: 'cat-shoes',
    category: { name: 'Shoes & Sneakers', slug: 'shoes' },
    images: [
      { url: 'https://images.unsplash.com/photo-1511556532299-8f662fc26c06?w=800' }
    ],
    reviews: [
      { id: 'rev-11', rating: 5, comment: 'Amazing bounce while jogging.', user: { name: 'Mark S.' }, createdAt: '2026-09-19' }
    ],
  },
  {
    id: 'prod-puma-rsx',
    title: 'Puma RS-X Triple Sneakers',
    slug: 'puma-rsx-triple',
    description: 'Retro-futuristic silhouette with bulky design, mesh upper, and soft cushioned RS technology.',
    price: 110.0,
    discount: 20.0,
    stock: 35,
    sku: 'PUMA-RSX-3',
    brand: { name: 'Puma' },
    categoryId: 'cat-shoes',
    category: { name: 'Shoes & Sneakers', slug: 'shoes' },
    images: [
      { url: 'https://images.unsplash.com/photo-1608231387042-66d1773070a5?w=800' }
    ],
    reviews: [
      { id: 'rev-12', rating: 4, comment: 'Great street style aesthetics and comfortable sole.', user: { name: 'Ken O.' }, createdAt: '2026-09-20' }
    ],
  },
  {
    id: 'prod-levis-tee',
    title: "Levi's Classic Graphic Tee",
    slug: 'levis-classic-graphic-tee',
    description: 'Soft 100% cotton crewneck graphic t-shirt featuring iconic red tab logo.',
    price: 35.0,
    discount: 5.0,
    stock: 50,
    sku: 'LEV-TEE-CL',
    brand: { name: "Levi's" },
    categoryId: 'cat-tshirts',
    category: { name: 'T-Shirts & Tops', slug: 't-shirts' },
    images: [
      { url: 'https://images.unsplash.com/photo-1521572267360-ee0c2909d518?w=800' }
    ],
    reviews: [
      { id: 'rev-13', rating: 5, comment: 'Soft breathable cotton fabric.', user: { name: 'Anna K.' }, createdAt: '2026-09-21' }
    ],
  },
  {
    id: 'prod-nike-drifit',
    title: 'Nike Dri-FIT Sport Top',
    slug: 'nike-drifit-sport-top',
    description: 'Moisture-wicking athletic performance t-shirt engineered for intense workouts.',
    price: 45.0,
    discount: 5.0,
    stock: 45,
    sku: 'NIKE-DRI-TOP',
    brand: { name: 'Nike' },
    categoryId: 'cat-tshirts',
    category: { name: 'T-Shirts & Tops', slug: 't-shirts' },
    images: [
      { url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?w=800' }
    ],
    reviews: [
      { id: 'rev-14', rating: 5, comment: 'Stays dry during running and lifting.', user: { name: 'Sam J.' }, createdAt: '2026-09-22' }
    ],
  },
  {
    id: 'prod-levis-jacket',
    title: "Levi's Denim Trucker Jacket",
    slug: 'levis-denim-trucker-jacket',
    description: 'Original denim jacket created in 1967. Standard fit, durable cotton denim fabric.',
    price: 98.0,
    discount: 15.0,
    stock: 25,
    sku: 'LEV-DEN-JCK',
    brand: { name: "Levi's" },
    categoryId: 'cat-jackets',
    category: { name: 'Jackets & Coats', slug: 'jackets' },
    images: [
      { url: 'https://images.unsplash.com/photo-1576995853123-5a10305d93c0?w=800' }
    ],
    reviews: [
      { id: 'rev-15', rating: 5, comment: 'Timeless style that pairs with everything.', user: { name: 'Gary H.' }, createdAt: '2026-09-23' }
    ],
  },
  {
    id: 'prod-espresso',
    title: 'Espresso Maker Machine Pro',
    slug: 'espresso-maker-machine-pro',
    description: '15-bar Italian pressure pump espresso machine with integrated milk steam wand.',
    price: 249.0,
    discount: 30.0,
    stock: 20,
    sku: 'HOME-ESP-PRO',
    brand: { name: 'Bose Home' },
    categoryId: 'cat-appliances',
    category: { name: 'Kitchen & Appliances', slug: 'appliances' },
    images: [
      { url: 'https://images.unsplash.com/photo-1517668808822-9ebb02f2a0e6?w=800' }
    ],
    reviews: [
      { id: 'rev-16', rating: 5, comment: 'Makes barista-grade espresso with thick crema at home.', user: { name: 'Rachel Z.' }, createdAt: '2026-09-24' }
    ],
  },
  {
    id: 'prod-desk-lamp',
    title: 'Smart Ambient Desk Lamp',
    slug: 'smart-ambient-desk-lamp',
    description: 'RGB ambient desk lighting with wireless smartphone charging pad and touch control.',
    price: 89.0,
    discount: 10.0,
    stock: 35,
    sku: 'HOME-LAMP-RGB',
    brand: { name: 'Samsung Smart' },
    categoryId: 'cat-decor',
    category: { name: 'Home Decor & Lighting', slug: 'home-decor' },
    images: [
      { url: 'https://images.unsplash.com/photo-1507473885765-e6ed057f782c?w=800' }
    ],
    reviews: [
      { id: 'rev-17', rating: 5, comment: 'Great light modes for work and late night reading.', user: { name: 'Tyler B.' }, createdAt: '2026-09-25' }
    ],
  },
  {
    id: 'prod-ps5-console',
    title: 'Sony PlayStation 5 Console',
    slug: 'sony-playstation-5-console',
    description: 'Experience lightning fast loading with an ultra-high speed SSD, haptic feedback, 4K gaming.',
    price: 499.0,
    discount: 0.0,
    stock: 15,
    sku: 'SONY-PS5-CON',
    brand: { name: 'Sony' },
    categoryId: 'cat-consoles',
    category: { name: 'Consoles & Accessories', slug: 'consoles' },
    images: [
      { url: 'https://images.unsplash.com/photo-1606813907291-d86efa9b94db?w=800' }
    ],
    reviews: [
      { id: 'rev-18', rating: 5, comment: 'Graphics and load times are revolutionary!', user: { name: 'John Doe' }, createdAt: '2026-09-26' }
    ],
  },
  {
    id: 'prod-ps5-controller',
    title: 'Sony DualSense Wireless Controller',
    slug: 'sony-dualsense-wireless-controller',
    description: 'Discover a deeper gaming experience with adaptive triggers and dynamic haptic feedback.',
    price: 69.0,
    discount: 10.0,
    stock: 40,
    sku: 'SONY-DS5-CTRL',
    brand: { name: 'Sony' },
    categoryId: 'cat-consoles',
    category: { name: 'Consoles & Accessories', slug: 'consoles' },
    images: [
      { url: 'https://images.unsplash.com/photo-1607604276583-eef5d076aa5f?w=800' }
    ],
    reviews: [
      { id: 'rev-19', rating: 5, comment: 'Haptic feedback feels realistic and precise in racing games.', user: { name: 'Nathan E.' }, createdAt: '2026-09-27' }
    ],
  },
];

export function getFilteredProducts({ search = '', category = '', minPrice = '', maxPrice = '', sort = 'latest', page = 1, limit = 8 } = {}) {
  let list = [...FALLBACK_PRODUCTS];

  if (search) {
    const q = search.toLowerCase();
    list = list.filter(p => p.title.toLowerCase().includes(q) || p.description.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q));
  }

  if (category) {
    const cat = category.toLowerCase();
    list = list.filter(p => p.categoryId.toLowerCase().includes(cat) || p.category?.slug?.toLowerCase().includes(cat));
  }

  if (minPrice) {
    const min = parseFloat(minPrice);
    list = list.filter(p => (p.price - p.discount) >= min);
  }

  if (maxPrice) {
    const max = parseFloat(maxPrice);
    list = list.filter(p => (p.price - p.discount) <= max);
  }

  if (sort === 'price_asc') {
    list.sort((a, b) => (a.price - a.discount) - (b.price - b.discount));
  } else if (sort === 'price_desc') {
    list.sort((a, b) => (b.price - b.discount) - (a.price - a.discount));
  }

  const total = list.length;
  const pNum = parseInt(page) || 1;
  const lNum = parseInt(limit) || 8;
  const startIndex = (pNum - 1) * lNum;
  const paginated = list.slice(startIndex, startIndex + lNum);

  return {
    success: true,
    data: paginated,
    pagination: {
      total,
      page: pNum,
      limit: lNum,
      pages: Math.ceil(total / lNum) || 1,
    },
  };
}
