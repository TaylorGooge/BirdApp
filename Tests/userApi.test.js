/* eslint-disable max-len */
const request = require('supertest');
const app = require('../testApp');
jest.setTimeout(100000);

describe('POST /getUserId', () => {
  test('get unregistered user- should register the user', async () => {
    const response = await request(app)
        .post('/getUserID')
        .send({
          email: 'taylor@ethelscuriocabinet.com',
          userName: 'testuser',
        });
    expect(response.statusCode).toBe(200);
  });

  test('POST /getUserId get unregistered user- should 401 missing username', async () => {
    const response = await request(app)
        .post('/getUserID')
        .send({
          email: 't@g.com',
        });
    expect(response.statusCode).toBe(401);
  });

  test('POST /getUserId get registered user- returns the user info', async () => {
    const response = await request(app)
        .post('/getUserID')
        .send({
          email: 'taylorgooge@gmail.com',
        });
    expect(response.statusCode).toBe(200);
    const property = JSON.parse(response.text);
    expect(property).toEqual([{'id': 1, 'email': 'taylorgooge@gmail.com', 'userName': 'thebeek'}]);
  });
});


