const request = require('supertest');
const app = require('../testApp');

expect.extend({
  toBeNumberOrNull(received) {
    return received === null || typeof received === 'number' ? {
      message: () => `expected ${received} to be number or null`,
      pass: true,
    } : {
      message: () => `expected ${received} to be number or null`,
      pass: false,
    };
  },
});

describe('GET /getbirds', () => {
  test('get birds json', async () => {
    const response = await request(app)
        .get('/getbirds');
    expect(response.statusCode).toBe(200);
    const results = JSON.parse(response.text);
    results.forEach((result) => expect(result).toEqual({
      birdID: expect.any(Number),
      fourCode: expect.any(String),
      sixCode: expect.any(String),
      englishName: expect.any(String),
      scientificName: expect.any(String),
      birdGroup: expect.toBeNumberOrNull(),
    }));
  });
});

