const express = require('express');
const router = express.Router();

const StoryblokClient = require('storyblok-js-client')
const moment = require('moment');

const hubDemoEnabled = process.env.HUB_DEMO_ENABLED === 'true';
const storyBlokToken = process.env.STORYBLOK_TOKEN;

let Storyblok = new StoryblokClient({
  accessToken: storyBlokToken
})

//todo:
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
  Storyblok.get('cdn/stories/',{
    'starts_with': 'blog/'
  })
  .then(response => {
    let data = response.data.stories
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
    let data = response.data.story
    res.render('blog-post.html', {
      title: 'Appvia: Blog - ' + data.name ,
      story: renderStory(data.content.story),
      data: data,
      published: convertTime
    });
  }).catch(error => {
    console.log(error)
  })
});

router.get('/blog/tag/:tag', async function (req, res) {
  Storyblok.get('cdn/stories/', {
    'starts_with': 'blog/',
    'with_tag': req.params.tag
  })
  .then(response => {
    let data = response.data.stories
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
  Storyblok.get('cdn/stories/', {
    'starts_with': 'jobs/'
  })
  .then(response => {
    let data = response.data.stories
    res.render('careers.html', {
      title: 'Appvia: Careers',
      role: renderStory,
      data: data
    });
  }).catch(error => {
    console.log(error)
  })
});

router.get('/contact-us', function (req, res) {
  res.render('contact-us.html', {title: 'Appvia: Contact Us'});
});

router.get('/careers/:jobpost', async function (req, res) {
  Storyblok.get('cdn/stories/jobs/'+req.params.jobpost)
  .then(response => {
    let data = response.data.story
    res.render('job.html', {
      title: 'Appvia: Blog - ' + data.name,
      about: renderStory(data.content.About),
      role: renderStory(data.content.the_role),
      key_responsibilities: renderStory(data.content.key_responsibilities),
      attributes: renderStory(data.content.attributes),
      remuneration: renderStory(data.content.remuneration),
      security_clearance: renderStory(data.content.security_clearance),
      data: data,
      published: convertTime
    });

  }).catch(error => {
    console.log(error)
  })
});

router.get('/privacy-policy', function (req, res) {
  res.render('privacy-policy.html', {title: 'Appvia: Privacy Policy', hubDemoEnabled});
});

module.exports = router;
