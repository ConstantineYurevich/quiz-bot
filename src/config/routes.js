import route from 'koa-route'

import validate from './../webhooks/validate.js';
import sendReceive from './../webhooks/send-receive.js';

export default [
  route.get('/webhook', validate),
  route.post('/webhook', sendReceive),
];
