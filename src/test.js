import request from 'request';

async function test(ctx) {
  async function getQuestion(sender, answer) {
    const firstName = 'FB ' + sender;
    const userId = 'fb_' + firstName;

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
      console.log(response.body)
      ctx.body = JSON.stringify(response.body);
    });
  }

  getQuestion('123123');
}

export default test;
