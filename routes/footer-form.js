const router = require('express').Router();
const salesforce = require('../modules/salesforce');
const slack = require('../modules/slack');
const logger = require('../logger');

async function postFooterFormSubmitted(req, res) {
  logger.info('Data submitted: %j', req.body);
  try {
    nameParts = req.body.name.split(" ")
    // TODO concat all middle names to firstName?
    firstName = nameParts[0]
    lastName = nameParts.length === 1 ? "unknown" : nameParts[1]
    leadOrContact = {
      email: req.body.email,
      firstName: firstName,
      lastName: lastName,
      companyName: "unknown"
    }
    const sfContact = await salesforce.isContact(leadOrContact);
    if (sfContact) {
      await slack.message(
        slackWebhookUrl,
        `Stay in touch signup by contact ${req.email}`,
        `*Qualified Customer* want to talk!?!`
      );
    }
    res.render('footer-form-submit.html');
  } catch (err) {
    logger.error('Footer form request failed: %j', err);
    res.render('error.html', {
      title: 'Oops, sorry',
      message: 'Oops, sorry, error recording details',
      status: err.status,
      html_class: 'error',
      error: {}
    });
  }
}

router.post('/footer-form-submit.html', postFooterFormSubmitted);

module.exports = {
  router,
  postFooterFormSubmitted
};
