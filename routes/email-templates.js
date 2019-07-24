const router = require('express').Router();

router.get('/marketing-email-template', function (req, res) {
  res.render('email-templates/marketing-email-template.html', {title: 'Appvia: Marketing Email Template',  firstName: req.query.firstName, lastName: req.query.lastName,  cta: req.query.cta});
});

router.get('/email-kubecon-demo', function (req, res) {
  res.render('email-templates/email-kubecon-demo.html', {title: 'Appvia: Email Template',  firstName: req.query.firstName, cta: req.query.cta});
});


router.get('/email-kubecon-demo-created', function (req, res) {
  res.render('email-templates/email-kubecon-demo-created.html', {title: 'Appvia: Email Template',  firstName: req.query.firstName, cta: req.query.cta});
});

router.get('/email-kubecon-demo-delete', function (req, res) {
  res.render('email-templates/email-kubecon-demo-delete.html', {title: 'Appvia: Email Template',  firstName: req.query.firstName, cta: req.query.cta});
});

module.exports = router;
