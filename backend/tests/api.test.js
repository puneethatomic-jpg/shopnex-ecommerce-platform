const request = require('supertest');
const app = require('../src/app');
const prisma = require('../src/config/db');

describe('ShopNex API Integration Tests', () => {
  beforeAll(async () => {
    // Database is already pushed and seeded.
  });

  afterAll(async () => {
    await prisma.$disconnect();
  });

  test('GET /api/health - Health check status', async () => {
    const res = await request(app).get('/api/health');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.status).toBe('UP');
  });

  test('GET /api/products - Retrieve products list', async () => {
    const res = await request(app).get('/api/products');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
    expect(res.body.data.length).toBeGreaterThan(0);
    expect(res.body.data[0]).toHaveProperty('title');
  });

  test('GET /api/categories - Retrieve categories tree', async () => {
    const res = await request(app).get('/api/categories');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(Array.isArray(res.body.data)).toBe(true);
  });

  test('GET /api/cart - Retrieve cart (mock authenticated user)', async () => {
    const res = await request(app)
      .get('/api/cart')
      .set('Authorization', 'Bearer mock_customer_123');
    expect(res.statusCode).toBe(200);
    expect(res.body.success).toBe(true);
    expect(res.body.data).toHaveProperty('userId');
  });
});
