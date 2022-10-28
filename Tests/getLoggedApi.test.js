const request = require('supertest');
const app = require('../testApp');

describe('Get /getlogged', () => {
  test('get valid user', async () => {
    const response = await request(app)
        .get('/getlogged?email=taylorgooge@gmail.com');
    expect(response.statusCode).toBe(200);
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
  });

  test('request is empty', async () => {
    const response = await request(app)
        .get('/getlogged');
    expect(response.statusCode).toBe(401);
  });
});
