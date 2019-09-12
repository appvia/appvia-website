var express = require('express');
var Parser = require('rss-parser');
var parser = new Parser();
var router = express.Router();
const superagent = require('superagent');

const hubDemoEnabled = process.env.HUB_DEMO_ENABLED === 'true';

const jobs = require('../jobs').filter(j => j.active);

const apiBase = 'https://api.storyblok.com/v1/cdn/';
const token = 'pktLzISg00u5e33rrefWPgtt';

//todo: 
// - put token in env configs
// - refactor in to blog routes


async  function apiRequest(path, filter){
    try {
      console.log(apiBase + path + '?' + filter + '&token='+token)
      return await superagent.get(apiBase + path + '?' + filter + '&token='+token)
    } catch (err) {ß
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

router.get('/products/kubernetes-security-scanner', function (req, res) {
  res.render('kubernetes-security-scanner.html', {title: 'Appvia: Product'});
});

router.get('/services', function (req, res) {
  res.render('services.html', {title: 'Appvia: Services'});
});

router.get('/blog', async function (req, res) {
  res.render('blog.html', {title: 'Appvia: Blog', rss: await apiRequest('stories', '') });
});

router.get('/blog/:blogpost', async function (req, res) {
  res.render('blog-post.html', {title: 'Appvia: Blog', rss: await  apiRequest('stories/blog/'+req.params.blogpost, '') });
});

router.get('/blog/tag/:tag', async function (req, res) {
  res.render('blog-tags.html', {title: 'Appvia: Blog', rss: await  apiRequest('stories/', 'with_tag='+req.params.tag), tag: req.params.tag });
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
