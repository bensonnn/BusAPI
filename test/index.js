import request from 'request';
import assert from 'assert';
import _ from 'lodash';

import '../lib/index.js';

describe('Bus Server', () => {
  it('should return 200', done => {
    request.get('http://127.0.0.1:3000/nexttimes', (err, res, body) => {
      assert.equal(200, res.statusCode);
      done();
    });
  });
  it('should return an array', done => {
    request.get('http://127.0.0.1:3000/nexttimes', (err, res, body) => {
      body = JSON.parse(body)
      assert(_.isArray(body), true);
      done();
    });
  });
});
