import router from 'koa-router';
import moment from 'moment';
import _ from 'lodash';

let Router = router();

const NUM_OF_STOPS = 10;
const NUM_OF_ROUTES = 3;
const STOP_MIN_OFFSET = 2;
const ROUTE_MIN_OFFSET = 2;
const BASE_INTERVAL = 15; //every minutes


Router.get('/nextTimes', function (ctx) {
  ctx.body = generateStopMap(ctx.request.query.time);
});


function generateStopMap(time) {
  // Basic Structure
  // [
  //   { stopId: 1,
  //     routes: [
  //       {routeId: 1,
  //         nextTimes: ['utc', 'utc']
  //       }
  //     ]
  //   }
  // ]

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

function nextTwoTimes(time, offset1, offset2) {
  time = moment(parseInt(time, 10));
  let totalOffset = (offset1 * STOP_MIN_OFFSET) + (offset2 * ROUTE_MIN_OFFSET);
  let lastStopMin = Math.ceil(time.minute() / BASE_INTERVAL) * BASE_INTERVAL;
  let nextStop = time.minutes(0).add(lastStopMin + totalOffset, 'minute')

  return [nextStop.format(),
          nextStop.add(BASE_INTERVAL, 'minute').format()];
}

Router.get('*', function (ctx) {
  ctx.status = 404;
  ctx.body = 'We couldn`t find what you were looking for';
});


export default Router.routes();
