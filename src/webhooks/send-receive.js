import request from 'request';
import debug from './../utils/debug.js';


const token = "CAACiSuaZB4vsBAPigCLLKHDZAyHF7FQKyaVaZBfsFJBMloABBFcfIUkQWaDdAZBen2WZATYUIcQjObaZA3mVYtymQyHoZAPpZCmsv7WggtQRCwcUyJUsfNXSVCfbj3zPqtIlNcgdleFG80mfjLMidnbHZApraeUi9owCkw9fmOxrN2dut87AZCoGZBooIjE3Ww4wEgZD";

function isNumeric(n) {
  return !isNaN(parseFloat(n)) && isFinite(n);
}

function getQuestion(sender, answer, callback) {
  const firstName = 'FB ' + sender;
  const userId = 'fb_' + sender;

  request({
    url: 'http://dev.ratehunter.ru/qbot/qbot.php',
    qs: {
      first_name: firstName,
      user_id: userId,
      answer: answer
    },
    method: 'GET'
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
    callback(JSON.parse(response.body));
  });
}

function sendGenericMessage(sender, text, callback) {
  const messageData = {
    text: text
  };
  request({
    url: 'https://graph.facebook.com/v2.6/me/messages',
    qs: {
      access_token: token
    },
    method: 'POST',
    json: {
      recipient: {
        id: sender
      },
      message: messageData,
    }
  }, function(error, response, body) {
    if (error) {
      console.log('Error sending message: ', error);
    } else if (response.body.error) {
      console.log('Error: ', response.body.error);
    }
    if (callback) {
      callback();
    }
  });
}

async function sendReceive(ctx) {
  const req = ctx.request;
  ctx.body = 'OK';
  const messaging_events = req.body.entry[0].messaging;
  for (let i = 0; i < messaging_events.length; i++) {
    const event = req.body.entry[0].messaging[i];
    const sender = event.sender.id;
    if (event.message && event.message.text) {
      const text = event.message.text;
      let answer;
      if (text !== 'start' && isNumeric(text)) {
        answer = parseInt(text);
      }
      getQuestion(sender, answer, function(payload) {
        sendGenericMessage(sender, payload.question, function() {
          if (payload.answers && payload.answers.length > 0) {
            const options = ['Варианты ответов:'];
            let num = 0;
            for (const answer of payload.answers) {
              num++;
              options.push(num + '. ' + answer);
            }
            options.push("\nВвведите число от 1 до " + num);
            sendGenericMessage(sender, options.join("\n"));
          }
        });
      });
    }
  }
}

export default sendReceive;
