import route from 'koa-route'

import webhook from './../webhook.js';

export default [
  route.get('/webhook', webhook),
];
