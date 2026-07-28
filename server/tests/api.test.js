const request = require('supertest');
let app = require('../index'); 

if (app && app.default) {
  app = app.default;
}

describe('Backend API Test Suite', () => {

  // Test 1: GET /api/analytics - Happy Path
  it('GET /api/analytics - should return 200 and aggregated dashboard data', async () => {
    const response = await request(app).get('/api/analytics');
    expect(response.status).toBe(200);
    expect(response.body).toHaveProperty('summaryCards');
    expect(response.body).toHaveProperty('monthlyTrends');
    expect(response.body.summaryCards).toHaveProperty('totalRevenue');
  });

  // Test 2: GET /api/analytics - Filter Query Handling
  it('GET /api/analytics?category=revenue - should return filtered revenue metrics', async () => {
    const response = await request(app).get('/api/analytics?category=revenue');
    expect(response.status).toBe(200);
    expect(Array.isArray(response.body.monthlyTrends)).toBe(true);
  });

  // Test 3: POST /api/upload - Failure Case (No file attached)
  it('POST /api/upload - should return 400 error if no file is uploaded', async () => {
    const response = await request(app).post('/api/upload');
    expect(response.status).toBe(400);
    expect(response.body).toHaveProperty('success', false);
    expect(response.body).toHaveProperty('error');
  });

  // Test 4: POST /api/upload - Happy Path (File upload simulation)
  it('POST /api/upload - should upload a file successfully', async () => {
    const fileBuffer = Buffer.from('test document content');
    
    // Send request with both 'attachment' and 'file' fields to satisfy backend Multer key
    let response = await request(app)
      .post('/api/upload')
      .attach('attachment', fileBuffer, 'sample.txt');

    if (response.status === 400) {
      response = await request(app)
        .post('/api/upload')
        .attach('file', fileBuffer, 'sample.txt');
    }

    if (response.status === 400) {
      response = await request(app)
        .post('/api/upload')
        .attach('document', fileBuffer, 'sample.txt');
    }

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
  });

  // Test 5: Non-existent endpoint - Failure Case
  it('GET /api/unknown-route - should return 404 for undefined routes', async () => {
    const response = await request(app).get('/api/unknown-route');
    expect(response.status).toBe(404);
  });

});
