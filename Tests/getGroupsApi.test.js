const request = require('supertest');
const app = require('../testApp');

describe('Get /getgroups', () => {
  test('get bird functional groups', async () => {
    const response = await request(app)
        .get('/getgroups');
    expect(response.statusCode).toBe(200);
    const results = JSON.parse(response.text);
    results.forEach((result) => expect(result).toEqual({
      id: expect.any(Number),
      name: expect.any(String),
    }));
  });
});
