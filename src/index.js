'use strict';

import Koa from 'koa';
import compose from 'koa-compose';

import routes from './config/routes'

const app = new Koa();

app.use(compose(routes));

app.listen(3000);

export default app;
