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
          bird:
          coordA,
          coordB,
          date: date,
        });
    expect(response.statusCode).toBe(200);
  });
});
