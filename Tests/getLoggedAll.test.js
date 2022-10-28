const request = require('supertest');
const app = require('../testApp');

describe('Get /getloggedAll', () => {
  test('get valid user', async () => {
    const response = await request(app)
        .get('/getlogged?email=taylorgooge@gmail.com');
    expect(response.statusCode).toBe(200);
    const results = JSON.parse(response.text);
    results.forEach((result) => expect(result).toEqual({
      englishName: expect.any(String),
      date: expect.any(String),
      userName: expect.any(String),
      birdID: expect.any(Number),
      coordA: expect.any(String),
      coordB: expect.any(String),
      id: expect.any(Number),
      userID: expect.any(Number),
    }));
  });
});
