var express = require('express');
var Parser = require('rss-parser');
var parser = new Parser();
var router = express.Router();

const hubDemoEnabled = process.env.HUB_DEMO_ENABLED === 'true';
const jobs = require('../jobs').filter(j => j.active);

async function getBlogFeed() {
  try {
    return await parser.parseURL('https://medium.com/feed/appvia');
  } catch (err) {
    return {items: []}
  }
}

router.get('/', function (req, res) {
  res.render('index.html', {title: 'Appvia: Home', hubDemoEnabled});
});

router.get('/why-appvia', function (req, res) {
  res.render('why-appvia.html', {title: 'Appvia: Why Appvia'});
});

router.get('/products', function (req, res) {
  res.render('products.html', {title: 'Appvia: Products'});
});

router.get('/products/hub', function (req, res) {
  res.render('hub.html', {title: 'Appvia: Hub'});
});

router.get('/products/product', function (req, res) {
  res.render('product.html', {title: 'Appvia: Product'});
});


router.get('/blog', async function (req, res) {
  res.render('blog.html', {title: 'Appvia: Blog', rss: await getBlogFeed(), hubDemoEnabled});
});

router.get('/careers', function (req, res) {
  res.render('careers.html', {title: 'Appvia: Careers', jobCount: jobs.length, jobs, hubDemoEnabled});
});

router.get('/contact-us', function (req, res) {
  res.render('contact-us.html', {title: 'Appvia: Contact Us'});
});

jobs.forEach(job => {
  router.get(`/careers/${job.slug}`, function (req, res) {
    res.render('job.html', {title: 'Appvia: Careers', job: job, hubDemoEnabled});
  });
});

router.get('/privacy-policy', function (req, res) {
  res.render('privacy-policy.html', {title: 'Appvia: Privacy Policy', hubDemoEnabled});
});

module.exports = router;
