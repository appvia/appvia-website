var express = require('express');
var path = require('path');
var favicon = require('serve-favicon');
var morgan = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var nunjucks = require('nunjucks');
var compression = require('compression');
var logger = require('./logger');

var app = express();

const routes = require('./routes/index');
const hubDemo = require('./routes/hub-demo');
const hubUserDeveloper = require('./routes/hub-user-developer');
const footerForm = require('./routes/footer-form');

const hubDemoEnabled = process.env.HUB_DEMO_ENABLED === 'true';

//compression
app.use(compression());

//Nunjucks setup
nunjucks.configure('views', {
  autoescape: true,
  express: app
});
app.set('view engine', 'nunjucks');

app.use('/assets', express.static(path.join(__dirname, 'public')));


// uncomment after placing your favicon in /public
//app.use(favicon(__dirname + '/public/images/favicon.png'));
app.use(morgan('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));

// Routes setup
app.use(routes);
app.use(footerForm.router);
app.use(hubUserDeveloper.router);
if (hubDemoEnabled) {
  app.use(hubDemo.router);
}
// catch 404 and forward to error handler
app.use(function (req, res, next) {
  var err = new Error('Not Found');
  err.status = 404;
  next(err);
});

// error handlers

// development error handler
// will print stacktrace
if (app.get('env') === 'development') {
  app.use(function (err, req, res, next) {
    res.status(err.status || 500);
    res.render('error.html', {
      title: err.message,
      message: err.message,
      status: err.status,
      html_class: 'error',
      error: err,
      pageClass: 'content fixed-background'
    });
  });
}

// production error handler
// no stacktraces leaked to user
app.use(function (err, req, res, next) {
  res.status(err.status || 500);
  res.render('error.html', {
    title: err.message,
    message: err.message,
    status: err.status,
    html_class: 'error',
    error: {},
    pageClass: 'content fixed-background'
  });
});


module.exports = app;
