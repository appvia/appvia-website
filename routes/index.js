var express = require('express');
var salesforce = require('../modules/salesforce');
var gform = require('../modules/gform');
var slack = require('../modules/slack');
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

router.get('/marketing-email-template', function (req, res) {
  res.render('marketing-email-template.html', {title: 'Appvia: Marketing Email Template',  firstName: req.query.firstName, lastName: req.query.lastName,  cta: req.query.cta});
});

router.get('/email-template', function (req, res) {
  res.render('email-template.html', {title: 'Appvia: Email Template',  firstName: req.query.firstName, lastName: req.query.lastName,   cta: req.query.cta});
});

if (hubDemoEnabled) {

    router.get('/products/hub-demo', function (req, res) {
        res.render('demo.html', {
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
        res.render('request-submit.html', {title: 'Appvia: Thank you for your request'});
    });

    router.post('/products/request-submit', async function (req, res) {
        console.log('Data submitted:', req.body);
        try {
            await gform.addContact(req.body);
            const sfContact = await salesforce.isContact(req.body);
            if (sfContact) {
                await slack.message(
                    process.env.SLACK_DEMOS_URL,
                    `New demo creation required for: ${req.body.email}`,
                    `*Qualified Customer* please create a new demo for ${req.body.email} at ${req.body.companyName}`
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
        res.render('request-submit-pending.html', {title: 'Appvia: Request Pending'});
    });

    router.get('/products/hub-demo/my-demo', function (req, res) {
        res.render('my-demo.html', {title: 'Appvia: My Demo', email: req.query.email});
    });

    router.get('/products/hub-demo/integration-setup-admin-pages', function (req, res) {
        res.render('integration-setup-admin-pages.html', {title: 'Appvia: Integration Setup Admin Pages'});
    });

    router.get('/products/hub-demo/feedback', function (req, res) {
      res.render('feedback.html', {title: 'Appvia: Hub Demo Feedback' });
    });

}

module.exports = router;
