const router = require('express').Router();
const salesforce = require('../modules/salesforce');
const gform = require('../modules/gform');
const slack = require('../modules/slack');
const demo = require('../modules/demo');

router.get('/products/hub-demo', function (req, res) {
  res.render('hub-demo/demo.html', {
    title: 'Appvia: Request a Hub Demo',
    slug: req.query.slug,
    firstName: req.query.firstName,
    lastName: req.query.lastName,
    email: req.query.email,
    companyName: req.query.companyName,
    companySize: req.query.companySize,
    role: req.query.role,
    github: req.query.github,
    errors: req.query.errors
  });
});

router.get('/products/request-submit', function (req, res) {
  res.render('hub-demo/request-submit.html', {title: 'Appvia: Thank you for your request'});
});

router.post('/products/request-submit', async function (req, res) {
  console.log('Data submitted:', req.body);
  try {
    var gformData = req.body;
    var demoData = demo.getDemoDetails(req.body.email);
    gformData.demoName = demoData.demoName;
    await gform.addRowToSheet(gformData, process.env.DEMO_REQUEST_GFORM_URL);
    const sfContact = await salesforce.isContact(req.body);
    if (sfContact) {
      await slack.message(
        process.env.SLACK_DEMOS_URL,
        `Please create new demo ${demoData.demoURL}`,
        `*Qualified Customer* please create a new demo:
        URL: ${demoData.demoURL}
        Demo name: ${demoData.demoName}
        Contact email: ${demoData.email}
        Company: ${req.body.companyName}
        Instructions - https://github.com/appvia/hub-demo-deployments#setup-a-demo-instance`
      );
      res.redirect('/products/request-submit');
    } else {
      res.redirect('/products/request-submit-pending');
    }
  } catch (err) {
    console.log('Demo request failed:', err);
    res.render('error.html', {
      title: "Oops, sorry",
      message: "Oops, sorry, error recording details",
      status: err.status,
      html_class: 'error',
      error: {}
    });
  }
});

// Not a contact, but in form - we'll get back to them:
router.get('/products/request-submit-pending', function (req, res) {
  res.render('hub-demo/request-submit-pending.html', {title: 'Appvia: Request Pending'});
});

router.get('/products/hub-demo/my-demo', async function (req, res) {
  // If we have an email
  console.log(req.query.email);
  if (req.query.email === undefined ) {
    console.log('No email');
    res.render('hub-demo/my-demo-no-email.html', {title: 'Appvia: My Demo' });
  } else {
    console.log('Data submitted:', req.body);
    try {
      // Don't try and create a lead here - redirect first...
      const sfContact = await salesforce.isContact(req.query, false);
      if (sfContact) {
        demoDetails = demo.getDemoDetails(req.query.email);
        res.render('hub-demo/my-demo.html', {title: 'Appvia: My Demo', demoURL: demoDetails.demoURL });
      } else {
        // Ask them to fill in a request (they're not a contact...)
        res.redirect('/products/hub-demo');
      }
    } catch (err) {
      console.log('My Demo request failed:', err);
      res.render('error.html', {
        title: "Oops, sorry",
        message: "Oops, sorry, error checking details",
        status: err.status,
        html_class: 'error',
        error: {}
      });
    }
  }
});

router.get('/products/hub-demo/integration-setup-admin-pages', function (req, res) {
  res.render('hub-demo/integration-setup-admin-pages.html', {title: 'Appvia: Integration Setup Admin Pages'});
});

router.get('/products/hub-demo/feedback', function (req, res) {
  res.render('hub-demo/feedback.html', {title: 'Appvia: Hub Demo Feedback', email: req.query.email });
});

router.post('/products/hub-demo/feedback-submit', async function (req, res) {
  console.log('Data submitted:', req.body);
  try {
    console.log('process.env.DEMO_FEEDBACK_GFORM_URL:' + process.env.DEMO_FEEDBACK_GFORM_URL);
    const gFormData = {
      email: req.body.email,
      rating: req.body.rating,
      message: req.body.message
    };
    gform.flattenDataWithOther(req.body, gFormData, 'application-types[]', 'application-types-other');
    gform.flattenDataWithOther(req.body, gFormData, 'kube-offerings[]', 'kube-offerings-other');
    gform.flattenDataWithOther(req.body, gFormData, 'cloud-providers[]', 'cloud-providers-other');
    gform.flattenDataWithOther(req.body, gFormData, 'features[]');
    gform.flattenDataWithOther(req.body, gFormData, 'devs-in-my-team');
    gform.flattenDataWithOther(req.body, gFormData, 'dev-teams-in-org');
    await gform.addRowToSheet(gFormData, process.env.DEMO_FEEDBACK_GFORM_URL);
    await slack.message(
      process.env.SLACK_DEMOS_URL,
      `Feedback form submitted for: ${req.body.email}`,
      `FYI ${req.body.email} has provided feedback!!!`
    );
    res.render('hub-demo/feedback-submit.html', {title: 'Appvia: Hub Demo Feedback' });
  } catch (err) {
    console.log('Feedback form failed:', err);
    res.render('error.html', {
      title: "Oops, sorry",
      message: "Oops, sorry, error recording details",
      status: err.status,
      html_class: 'error',
      error: {}
    });
  }
});

module.exports = router;
