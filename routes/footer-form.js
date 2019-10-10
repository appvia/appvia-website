const router = require('express').Router();
const salesforce = require('../modules/salesforce');
const logger = require('../logger');

async function postFooterFormSubmitted(req, res) {
  logger.info('Data submitted: %j', req.body);
  try {
    const nameParts = req.body.name.split(" ")
    // TODO concat all middle names to firstName?
    const firstName = nameParts[0]
    const lastName = nameParts.length === 1 ? "unknown" : nameParts[1]
    const leadOrContact = {
      email: req.body.email,
      firstName: firstName,
      lastName: lastName,
      companyName: "unknown"
    }
    const sfContact = await salesforce.isContact(leadOrContact);
    if (sfContact) {
      logger.info('Existing contact signed up: %j', req.body.email);
    } else {
      logger.info('Lead signed up: %j', req.body.email);
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
