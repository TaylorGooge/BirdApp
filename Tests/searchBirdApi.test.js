const request = require('supertest');
const app = require('../testApp');

describe('Get /searchBird', () => {
  test('search bird empty request', async () => {
    const response = await request(app)
        .get('/searchBird');
    expect(response.statusCode).toBe(401);
  });

  test('search bird by ID valid id ', async () => {
    const response = await request(app)
        .get('/searchBird?id=1065');
    expect(response.statusCode).toBe(200);
    const results = JSON.parse(response.text);
    results.forEach((result) => expect(result).toEqual({
      birdId: expect.any(Number),
      date: expect.any(String),
      id: expect.any(Number),
      coordA: expect.any(String),
      coordB: expect.any(String),
      userID: expect.any(Number),
      userName: expect.any(String),
      englishName: expect.any(String),
    }));
  });

  test('search bird by ID invalid id ', async () => {
    const response = await request(app)
        .get('/searchBird?id=1');
    expect(response.statusCode).toBe(200);
    const results = JSON.parse(response.text);
    expect(results.length).toBe(0);
  });

  test('search bird by ID valid id with results', async () => {
    const response = await request(app)
        .get('/searchBird?group=1');
    expect(response.statusCode).toBe(200);
    const results = JSON.parse(response.text);
    results.forEach((result) => expect(result).toEqual({
      birdId: expect.any(Number),
      date: expect.any(String),
      id: expect.any(Number),
      coordA: expect.any(String),
      coordB: expect.any(String),
      userID: expect.any(Number),
      userName: expect.any(String),
      englishName: expect.any(String),
    }));
  });

  test('search bird by ID valid id with no results', async () => {
    const response = await request(app)
        .get('/searchBird?group=3');
    expect(response.statusCode).toBe(200);
    const results = JSON.parse(response.text);
    expect(results.length).toBe(0);
  });
});
