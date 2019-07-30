const sinon = require('sinon');
const expect = require('chai').expect;
const nock = require('nock');

const slack = require('../../modules/slack');

const isDev = process.env.DEV_SITE === 'true';

describe('modules/slack', function() {
  const slackUrl = 'https://slack.com';
  const getSlackRequestBody = (title, text) => ({
    'channel': isDev ? 'test-notifications' : 'hub-demo-admin',
    'icon_emoji': ':tada:',
    'attachments': [{
      'fallback': text,
      'color': 'good',
      'fields': [{
        'title': title,
        'value': text
      }]
    }]
  });
  const nockSetup = (statusCode, body) => {
    return nock(slackUrl)
      .post('/', getSlackRequestBody('My title', 'My text'))
      .reply(statusCode, body);
  };
  let consoleErrorStub;

  beforeEach(function() {
    consoleErrorStub = sinon.stub(console, 'error');
  });

  afterEach(function() {
    consoleErrorStub.restore();
  });

  describe('#message()', function() {
    it('resolves', function() {
      nockSetup(200, 'ok');
      return expect(slack.message(slackUrl, 'My title', 'My text')).to.eventually.be.fulfilled;
    });
    it('sends slack notification successfully', async function() {
      const scope = nockSetup(200, 'ok');
      await slack.message(slackUrl, 'My title', 'My text');
      expect(nock.isDone()).to.be.true;
    });
    it('resolves when receiving invalid_payload', async function() {
      nockSetup(200, 'invalid_payload');
      await slack.message(slackUrl, 'My title', 'My text');
      expect(consoleErrorStub).to.be.calledOnce;
    });
    it('errors and resolves when receiving an error', async function() {
      nockSetup(500, 'server_error');
      await slack.message(slackUrl, 'My title', 'My text');
      expect(consoleErrorStub).to.be.calledOnce;
    });
  });

});
