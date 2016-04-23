import debug from './utils/debug.js';

async function webhook(ctx) {
  const req = ctx.request;
  if (req.query['hub.verify_token'] === 'test' && req.query['hub.challenge']) {
    ctx.body = req.query['hub.challenge'];
  } else {
    ctx.body = 'Error, wrong validation token';
  }
}

export default webhook;
