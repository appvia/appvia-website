const router = require('express').Router();
const salesforce = require('../modules/salesforce');
const gform = require('../modules/gform');
const logger = require('../logger');

const googleDocHubUserResearchDeveloperUrl = process.env.GDOC_URL_HUB_USER_RESEARCH_DEVELOPER;

function getHubUserResearchDeveloper(req, res) {
  res.render('hub-user-research-developers.html', {title: 'Appvia: Hub User Research: Developers' });
}

async function postSubmitHubUserResearchDeveloper(req, res) {
  logger.info('Data submitted: %j', req.body);
  try {
    logger.info('googleDocHubUserResearchDeveloperUrl: ' + googleDocHubUserResearchDeveloperUrl);
    const gFormData = {
      email: req.body.email,
      firstName: req.body.firstName,
      lastName: req.body.lastName,
      programmingLanguages: req.body.programmingLanguages,
      anyDockerOrKubernetes: req.body.anyDockerOrKubernetes,
      companyName: "unknown" // for salesforce
    };
    gform.flattenDataWithOther(req.body, gFormData, 'yearsDeveloping');
    await gform.addRowToSheet(gFormData, googleDocHubUserResearchDeveloperUrl);
    try {
      const sfContact = await salesforce.isContact(gFormData);
      if (sfContact) {
        logger.info('added existing contact for user research (developer) - ' + gFormData.email);
      } else {
        logger.info('created lead for ' + gFormData.email);
      }
    } catch (err) {
      logger.error('Error checking salesforce: %j', err);
    }
    res.render('hub-user-research-developers-submit.html', {title: 'Appvia: Hub User Research: Developers' });
  } catch (err) {
    logger.error('Feedback form failed: %j', err);
    res.render('error.html', {
      title: 'Oops, sorry',
      message: 'Oops, sorry, error recording details',
      status: err.status,
      html_class: 'error',
      error: {}
    });
  }
}

router.get('/products/hub/user-research-developer', getHubUserResearchDeveloper);
router.post('/products/hub/user-research-developer-submit', postSubmitHubUserResearchDeveloper);

module.exports = {
  router,
  getHubUserResearchDeveloper,
  postSubmitHubUserResearchDeveloper
};
