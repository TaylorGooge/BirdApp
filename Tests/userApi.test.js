/* eslint-disable max-len */
const request = require('supertest');
const app = require('../testApp');

describe('POST /getUserId', () => {
  test('get unregistered user- should register the user', async () => {
    const response = await request(app)
        .post('/getUserID?email=taylor@ethelscuriocabinet.com&userName=testUser');
    expect(response.statusCode).toBe(200);
  });

  test('POST /getUserId get unregistered user- should 401 missing username', async () => {
    const response = await request(app)
        .post('/getUserID?email=t@g.com');
    expect(response.statusCode).toBe(401);
  });

  test('POST /getUserId get unregistered user- should 401 missing email', async () => {
    const response = await request(app)
        .post('/getUserID?userName=testingthisAPP');
    expect(response.statusCode).toBe(401);
  });

  test('POST /getUserId get registered user with email - returns the user info', async () => {
    const response = await request(app)
        .post('/getUserID?email=taylorgooge@gmail.com');
    expect(response.statusCode).toBe(200);
    const property = JSON.parse(response.text);
    expect(property).toEqual([{'id': 1, 'email': 'taylorgooge@gmail.com', 'userName': 'thebeek'}]);
  });
});

test('POST /getUserId get registered user with userName - should 401 missing email', async () => {
  const response = await request(app)
      .post('/getUserID?userName=whateverhere');
  expect(response.statusCode).toBe(401);
});


