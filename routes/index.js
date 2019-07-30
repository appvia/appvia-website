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
    res.render('products.html', {title: 'Appvia: Products', hubDemoEnabled});
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

router.get('/privacy-policy', function (req, res) {
  res.render('privacy-policy.html', {title: 'Appvia: Privacy Policy'});
});

router.get('/new', function (req, res) {
  res.render('new.html', {title: 'Appvia'});
});

module.exports = router;
