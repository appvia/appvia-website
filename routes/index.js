var express = require('express');
var Parser = require('rss-parser');
var parser = new Parser();
var router = express.Router();

const jobs = require('../jobs').filter(j => j.active);

async function getBlogFeed() {
    try {
        return await parser.parseURL('https://medium.com/feed/appvia');
    } catch (err) {
        return { items: [] }
    }
}

router.get('/', function (req, res) {
    res.render('index.html', {title: 'Appvia: Home'});
});

router.get('/about', function (req, res) {
    res.render('about.html', {title: 'Appvia: About'});
});

router.get('/products', function (req, res) {
    res.render('products.html', {title: 'Appvia: Products'});
});

router.get('/services', function (req, res) {
    res.render('services.html', {title: 'Appvia: Services'});
});

router.get('/blog', async function (req, res) {
    res.render('blog.html', {title: 'Appvia: Blog', rss: await getBlogFeed()});
});

router.get('/careers', function (req, res) {
  res.render('careers.html', {title: 'Appvia: Careers', jobCount: jobs.length, jobs});
});

jobs.forEach(job => {
    router.get(`/careers/${job.slug}`, function (req, res) {
        res.render('job.html', {title: 'Appvia: Careers', job: job});
    });
});

router.get('/contact', function (req, res) {
  res.render('contact.html', {title: 'Appvia: Contact'});
});

router.get('/marketing-email-template', function (req, res) {
  res.render('marketing-email-template.html', {title: 'Appvia: Marketing Email Template',  firstName: req.query.firstName, lastName: req.query.lastName,  cta: req.query.cta});
});

router.get('/email-template', function (req, res) {
  res.render('email-template.html', {title: 'Appvia: Email Template',  firstName: req.query.firstName, lastName: req.query.lastName,   cta: req.query.cta});
});

router.get('/products/hub-demo', function (req, res) {
  res.render('demo.html', {
    title: 'Appvia: Request a Demo',
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
  res.render('request-submit.html', {title: 'Appvia: Thank you for your request', qualified: true });
});

router.get('/products/hub-demo/my-demo', function (req, res) {
  res.render('my-demo.html', {title: 'Appvia: My Demo' });
});

module.exports = router;
