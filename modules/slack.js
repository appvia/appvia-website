const requestPromise = require('request-promise');
const logger = require('../logger');

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
  return requestPromise.post({ url: slackChannelUrl, json: data, resolveWithFullResponse: true })
  .then(resp => {
    if (resp.body === 'invalid_payload') {
      logger.error('Invalid payload submitted to slack: %j', data);
    } else {
      logger.info('Slack submission was successful');
    }
    // always resolve as we don't want an issue with slack to break the flow
    return Promise.resolve();
  })
  .catch(err => {
    logger.error('Slack error: %j', err);
    // always resolve as we don't want an issue with slack to break the flow
    return Promise.resolve();
  });
}

module.exports = { message };
