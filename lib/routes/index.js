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
  let trainIsHere = (time.minute() % BASE_INTERVAL === totalOffset);
  let trainHasPassed = (time.minute() % BASE_INTERVAL > totalOffset);

  if (!trainIsHere) {
    let lastStopMin = Math.round(time.minute() / BASE_INTERVAL) * BASE_INTERVAL + BASE_INTERVAL;
    let nextStop = moment(time.hour(), 'hh').add(lastStopMin + totalOffset, 'minute').subtract(trainHasPassed ? 0 : BASE_INTERVAL, 'minute');
    return [nextStop.format('hh:mm'),
            nextStop.add(BASE_INTERVAL, 'minute').format('hh:mm')];
  }
  return ['now', time.add(BASE_INTERVAL, 'minutes').format('hh:mm')];
}

Router.get('*', function (ctx) {
  ctx.status = 404;
  ctx.body = 'We couldn`t find what you were looking for';
});


export default Router.routes();
