var express = require('express');
var Parser = require('rss-parser');
var parser = new Parser();
var router = express.Router();

const StoryblokClient = require('storyblok-js-client')
const moment = require('moment');

const hubDemoEnabled = process.env.HUB_DEMO_ENABLED === 'true';

const jobs = require('../jobs').filter(j => j.active);

let Storyblok = new StoryblokClient({
  accessToken: 'jea6Oj4I6rk2WChhurZRUgtt'
})

//todo:
// - put token in env configs
// - refactor in to blog routes

function renderStory(data){
  return Storyblok.richTextResolver.render(data)
}
function convertTime(date){
  return moment(date).format("MMM Do YYYY");
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

router.get('/services/consultancy', function (req, res) {
  res.render('consultancy.html', {title: 'Appvia: Consultancy'});
});

router.get('/services/support', function (req, res) {
  res.render('support.html', {title: 'Appvia: Support'});
});


router.get('/blog', async function (req, res) {
  Storyblok.get('cdn/stories/')
  .then(response => {
    var data = response.data.stories
    res.render('blog.html', {
      title: 'Appvia: Blog',
      story: renderStory,
      data: data,
      published: convertTime
    });
  }).catch(error => {
    console.log(error)
  })
});

router.get('/blog/:blogpost', async function (req, res) {
  Storyblok.get('cdn/stories/blog/'+req.params.blogpost)
  .then(response => {
    var data = response.data.story
    res.render('blog-post.html', {
      title: 'Appvia: Blog - ' + data.name ,
      story: Storyblok.richTextResolver.render(data.content.story),
      data: data,
      published: convertTime
    });
  }).catch(error => {
    console.log(error)
  })
});

router.get('/blog/tag/:tag', async function (req, res) {
  Storyblok.get('cdn/stories/', {
    "with_tag": req.params.tag
  })
  .then(response => {
    var data = response.data.stories
    res.render('blog-tags.html', {
      title: 'Appvia: Blog - Tag: ' + req.params.tag,
      tag: req.params.tag,
      story: renderStory,
      data: data,
      published: convertTime
    });
  }).catch(error => {
    console.log(error)
  })
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
