const express = require('express');
const router = express.Router();
const logger = require('../logger');
const StoryblokClient = require('storyblok-js-client')
const moment = require('moment');

const hubDemoEnabled = process.env.HUB_DEMO_ENABLED === 'true';
const storyBlokToken = process.env.STORYBLOK_TOKEN;

const Storyblok = new StoryblokClient({
  accessToken: storyBlokToken
})

//todo:
// - refactor blog and job in to seperate route files

function renderStory(data) {
  return Storyblok.richTextResolver.render(data)
}

function convertTime(date) {
  return moment(date).format("MMM Do YYYY");
}

router.get('/', function(req, res) {
  res.render('index.html', {
    title: 'Appvia: Home'
  });
});

router.get('/why-appvia', function(req, res) {
  res.render('why-appvia.html', {
    title: 'Appvia: Why Appvia'
  });
});

router.get('/products', function(req, res) {
  res.render('products.html', {
    title: 'Appvia: Products'
  });
});

router.get('/products/hub', function(req, res) {
  res.render('hub.html', {
    title: 'Appvia: Hub',
    hubDemoEnabled
  });
});

router.get('/products/kubernetes-security-scanner', function(req, res) {
  res.render('kubernetes-security-scanner.html', {
    title: 'Appvia: Product'
  });
});

router.get('/services', function(req, res) {
  res.render('services.html', {
    title: 'Appvia: Services'
  });
});

router.get('/services/kubernetes', function(req, res) {
  res.render('kubernetes.html', {
    title: 'Appvia: Kubernetes'
  });
});

router.get('/services/consultancy', function(req, res) {
  res.render('consultancy.html', {
    title: 'Appvia: Consultancy'
  });
});

router.get('/services/support', function(req, res) {
  res.render('support.html', {
    title: 'Appvia: Support'
  });
});


router.get('/blog', function(req, res) {
  Storyblok.get('cdn/stories/', {
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
      logger.error('Page failed: %j', error);
      res.render('error.html', {
        title: error.name,
        message: error.response.statusText,
        status: error.response.status
      });
    });
});

router.get('/blog/:blogpost', async function(req, res) {
  Storyblok.get(`cdn/stories/blog/${req.params.blogpost}`)
    .then(response => {
      let data = response.data.story
      res.render('blog-post.html', {
        title: `Appvia: Blog - ${data.name}`,
        story: renderStory(data.content.story),
        data: data,
        published: convertTime
      });
    }).catch(error => {
      logger.error('Page failed: %j', error);
      res.render('error.html', {
        title: error.name,
        message: error.response.statusText,
        status: error.response.status
      });
    });
});

router.get('/blog/tag/:tag', function(req, res) {
  Storyblok.get('cdn/stories/', {
      'starts_with': 'blog/',
      'with_tag': req.params.tag
    })
    .then(response => {
      let data = response.data.stories
      res.render('blog-tags.html', {
        title: `Appvia: Blog - Tag: ${req.params.tag}`,
        tag: req.params.tag,
        story: renderStory,
        data: data,
        published: convertTime
      });
    }).catch(error => {
      logger.error('Page failed: %j', error);
      res.render('error.html', {
        title: error.name,
        message: error.response.statusText,
        status: error.response.status
      });
    });
});

router.get('/careers', function(req, res) {
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
      logger.error('Page failed: %j', error);
      res.render('error.html', {
        title: error.name,
        message: error.response.statusText,
        status: error.response.status
      });
    });
});

router.get('/contact-us', function(req, res) {
  res.render('contact-us.html', {
    title: 'Appvia: Contact Us'
  });
});

router.get('/careers/:jobpost', function(req, res) {
  Storyblok.get(`cdn/stories/jobs/${req.params.jobpost}`)
    .then(response => {
      let data = response.data.story
      res.render('job.html', {
        title: `Appvia: Blog - ${data.name}`,
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
      logger.error('Page failed: %j', error);
      res.render('error.html', {
        title: error.name,
        message: error.response.statusText,
        status: error.response.status
      });
    });
});

router.get('/privacy-policy', function(req, res) {
  res.render('privacy-policy.html', {
    title: 'Appvia: Privacy Policy'
  });
});

module.exports = router;
