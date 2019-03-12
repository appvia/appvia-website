var express = require('express');
var Parser = require('rss-parser');
var parser = new Parser();
var router = express.Router();

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

router.get('/contact', function (req, res) {
  res.render('contact.html', {title: 'Appvia: Contact'});
});


module.exports = router;
