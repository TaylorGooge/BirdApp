const request = require('supertest');
const app = require('../testApp');

describe('POST /getUserId', () => {
  test('get unregistered user- should register the user', async () => {
    const response = await request(app)
        .post('/getUserID')
        .send({
          email: 'taylor@ethelscuriocabinet.com',
        });
    expect(response.statusCode).toBe(200);
  });

  test('get registered user- returns the user id', async () => {
    const response = await request(app)
        .post('/getUserID')
        .send({
          email: 'taylorgooge@gmail.com',
        });
    expect(response.statusCode).toBe(200);
    const property = JSON.parse(response.text);
    expect(property).toEqual([{'id': 1, 'email': 'taylorgooge@gmail.com'}]);
  });
});


