const request = require('supertest');
const app = require('../testApp');

describe('Get /getlogged', () => {
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

  test('get unregistered user fail missing username', async () => {
    const response = await request(app)
        .get('/getlogged?email=t@g.com');
    expect(response.statusCode).toBe(401);
  });

  test('get unregistered user passing', async () => {
    const response = await request(app)
        .get('/getlogged?email=tdff@g.com&userName=doot');
    expect(response.statusCode).toBe(200);
    expect(response.text).toMatch('');
  });

  test('request is empty', async () => {
    const response = await request(app)
        .get('/getlogged');
    expect(response.statusCode).toBe(401);
  });
});
