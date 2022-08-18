const request = require('supertest');
const app = require('../testApp');

describe('POST /deleteEntry', () => {
  test('delete bird sighting pass', async () => {
    const response = await request(app)
        .post('/deleteEntry')
        .send({
          id: 17,
        });
    expect(response.statusCode).toBe(200);
  });

  test('delete bird sighting invalid  sighting id', async () => {
    const response = await request(app)
        .post('/deleteEntry')
        .send({
          id: '',
        });
    expect(response.statusCode).toBe(200);
    const results = JSON.parse(response.text);
    expect(results['affectedRows']).toBe(0);
  });
});

