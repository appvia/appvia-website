const router = require('express').Router();

router.get('/marketing-email-template', function (req, res) {
  res.render('email-templates/marketing-email-template.html', {title: 'Appvia: Marketing Email Template',  firstName: req.query.firstName, lastName: req.query.lastName,  cta: req.query.cta});
});

router.get('/email-template', function (req, res) {
  res.render('email-templates/email-template.html', {title: 'Appvia: Email Template',  firstName: req.query.firstName, lastName: req.query.lastName,   cta: req.query.cta});
});

module.exports = router;
