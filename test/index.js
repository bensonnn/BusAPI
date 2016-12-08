import request from 'request';
import assert from 'assert';
import _ from 'lodash';
import moment from 'moment';

const NUM_OF_STOPS = 10;
const NUM_OF_ROUTES = 3;
const STOP_MIN_OFFSET = 2;
const ROUTE_MIN_OFFSET = 2;
const BASE_INTERVAL = 15; //every minutes

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
  it('should return correctly formatted Bus Stop times', done => {
    let now = Date.now();
    request.get(`http://127.0.0.1:3000/nexttimes?time=${now}`, (err, res, body) => {
      body = JSON.parse(body);
      let expected = generateStopMap(now);
      assert.deepEqual(body, expected);
      done();
    });
  });
});


function nextTwoTimes(time, offset1, offset2) {
  time = moment(parseInt(time, 10));
  let totalOffset = (offset1 * STOP_MIN_OFFSET) + (offset2 * ROUTE_MIN_OFFSET);
  let trainIsHere = (time.minute() % BASE_INTERVAL === totalOffset);

  let lastStopMin = Math.round(time.minute() / BASE_INTERVAL) * BASE_INTERVAL + BASE_INTERVAL;
  let nextStop = moment(time.hour(), 'hh').add(lastStopMin + totalOffset, 'minute')
  return [nextStop.format(),
          nextStop.add(BASE_INTERVAL, 'minute').format()];
}


function generateStopMap(time) {
  let stops = [];

  for (let i=0; i<NUM_OF_STOPS; i++) {
    stops.push({
      stopId: i+1,
      routes: _.times(NUM_OF_ROUTES, (index) => {
        return {
          routeId: index + 1,
          nextTimes: nextTwoTimes(time, i, index)
        };
      })
    });
  }
  return stops;
}
