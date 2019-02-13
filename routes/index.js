var express = require('express');
var Parser = require('rss-parser');
var parser = new Parser();
var router = express.Router();


router.get('/', function(req, res) {
        res.render('index.html', {title: 'Appvia: Home'});
});

router.get('/about', function(req, res) {
        res.render('about.html', {title: 'Appvia: About'});
});

router.get('/products', function(req, res) {
        res.render('products.html', {title: 'Appvia: Products'});
});

router.get('/services', function(req, res) {
        res.render('services.html', {title: 'Appvia: Services'});
});

router.get('/blog', function(req, res) {

    (async () => {
      feed = await parser.parseURL('https://medium.com/feed/appvia');
      res.render('blog.html', {title: 'Appvia: Blog', rss: feed});
    })();

});

router.get('/contact', function(req, res) {
        res.render('contact.html', {title: 'Appvia: Blog'});
});


module.exports = router;
