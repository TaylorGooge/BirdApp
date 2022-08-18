const request = require('supertest');
const app = require('../testApp');
const moment = require('moment');

describe('POST /postBird', () => {
  test('create bird sighting pass', async () => {
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const response = await request(app)
        .post('/postBird')
        .send({
          email: 'taylorgooge@gmail.com',
          bird: 1063,
          coordA: 41.850033,
          coordB: -87.6500523,
          date: date,
        });
    expect(response.statusCode).toBe(200);
  });

  test('create bird sighting invalid bird', async () => {
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const response = await request(app)
        .post('/postBird')
        .send({
          email: 'taylorgooge@gmail.com',
          bird: 'test',
          coordA: 41.850033,
          coordB: -87.6500523,
          date: date,
        });
    expect(response.statusCode).toBe(401);
  });
  test('create bird sighting invalid email', async () => {
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const response = await request(app)
        .post('/postBird')
        .send({
          email: '.com',
          bird: 1063,
          coordA: 41.850033,
          coordB: -87.6500523,
          date: date,
        });
    expect(response.statusCode).toBe(401);
  });

  test('create bird sighting invalid coordA', async () => {
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const response = await request(app)
        .post('/postBird')
        .send({
          email: '.com',
          bird: 1063,
          coordA: 'A',
          coordB: -87.6500523,
          date: date,
        });
    expect(response.statusCode).toBe(401);
  });

  test('create bird sighting invalid coordB', async () => {
    const date = moment(new Date()).format('YYYY-MM-DD HH:mm:ss');
    const response = await request(app)
        .post('/postBird')
        .send({
          email: '.com',
          bird: 1063,
          coordA: 41.850033,
          coordB: 'A',
          date: date,
        });
    expect(response.statusCode).toBe(401);
  });

  test('create bird sighting invalid coordB', async () => {
    const response = await request(app)
        .post('/postBird')
        .send({
          email: '.com',
          bird: 1063,
          coordA: 41.850033,
          coordB: -87.6500523,
          date: '2022-08-15',
        });
    expect(response.statusCode).toBe(401);
  });
});

