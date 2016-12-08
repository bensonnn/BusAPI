import compress from 'koa-compress';
import cors from 'kcors';
// import logger from 'koa-logger';
import koa from 'koa';
import helmet from 'koa-helmet';

import routes from './routes';

let app = new koa();
app.use(helmet());
app.use(compress());
app.use(cors());
app.use(routes);

app.listen(3000);

console.log('app listening on port 3000');
