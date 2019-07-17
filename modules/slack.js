var request = require('request');

function message(
  slackChannelUrl,
  title,
  text,
  icon_emoji = ":tada:",
  fallback = text,
  color = "good"
) {
  data = {
    "icon_emoji": icon_emoji,
    "attachments": [
      {
        "fallback": fallback,
        "color": color,
        "fields": [
          {
            "title": title,
            "value": text
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
  return new Promise(function(resolve, reject) {
    // Do async job
    var slackURL = slackChannelUrl;
    request({ url: slackChannelUrl, method: "POST", json: data }, function(err, resp, body) {
      if (err) {
        console.log('Slack error!' + body)
        reject(err);
      } else {
        if (body == 'invalid_payload') {
          reject(new Error('Invalid payload submitted to slack:' + data))
        }
        // all good, as far as trying to post
        console.log('Slack submission was successful');
        resolve();
      }
    })
  });
}

// slack.js
// ========
module.exports = {
  message: message,
  messageRaw: messageRaw
};
