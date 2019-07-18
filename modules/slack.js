const requestPromise = require('request-promise');

const isDev = process.env.DEV_SITE === 'true';

function message(
  slackChannelUrl,
  title,
  text,
  icon_emoji = ':tada:',
  fallback = text,
  color = 'good'
) {
  data = {
    'channel': isDev ? 'test-notifications' : 'hub-demo-admin',
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
  return requestPromise({ url: slackChannelUrl, method: 'POST', json: data })
  .then((resp, body) => {
    if (body === 'invalid_payload') {
      console.error('Invalid payload submitted to slack:', data)
    }
    console.log('Slack submission was successful');
    // always resolve as we don't want an issue with slack to break the flow
    return Promise.resolve();
  })
  .catch(err => {
    console.error('Slack error:', err);
    // always resolve as we don't want an issue with slack to break the flow
    return Promise.resolve();
  });
}

module.exports = { message, messageRaw };
