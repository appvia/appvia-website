var requestPromise = require('request-promise');

function message(
  slackChannelUrl,
  title,
  text,
  icon_emoji = ':tada:',
  fallback = text,
  color = 'good'
) {
  data = {
    'icon_emoji': icon_emoji,
    'attachments': [
      {
        'fallback': fallback,
        'color': color,
        'fields': [
          {
            'title': title,
            'value': text
          }
        ]
      }
    ]
  };
  return messageRaw(slackChannelUrl, data);
}

function messageRaw(slackChannelUrl, data) {
  /*
    Will post to slack
  */
  var slackURL = slackChannelUrl;
  return requestPromise({ url: slackChannelUrl, method: 'POST', json: data })
  .then((resp, body) => {
    if (body == 'invalid_payload') {
      return Promise.reject(new Error(`Invalid payload submitted to slack: ${data}`))
    }
    // all good, as far as trying to post
    console.log('Slack submission was successful');
  })
  .catch(err => {
    console.log(`Slack error: ${err.body}`)
    return Promise.reject(err);
  });
}

// slack.js
// ========
module.exports = {
  message: message,
  messageRaw: messageRaw
};
