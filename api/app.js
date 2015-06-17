var express = require('express');
var path = require('path');
var logger = require('morgan');
var cookieParser = require('cookie-parser');
var bodyParser = require('body-parser');
var models = require('./models/index.js');
var oauth2 = require('./oauth2');
var request = require('request');
var passport = require('passport');

var app = express();

/**
 * Middleware Setup
 */

var allowCrossDomain = function(req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Headers", "Authorization, Content-Type");
    next();
};
app.use(logger('dev'));
app.use(bodyParser.urlencoded({
    extended: true
}));
app.use(bodyParser.json());
app.use(cookieParser());
app.use(allowCrossDomain);
app.use(passport.initialize());

var auth = require('./auth');

app.passport = passport;

/**
 * Register the routes the app will use
 */

var index  = require('./routes/index');
var users  = require('./routes/users')(app);
var secret = require('./routes/secret')(app);
var public = require('./routes/public');
var logout = require('./routes/logout')(app);
var checkSession = require('./routes/checkSession')(app);
var dbSeed = require('./routes/dbSeed');
var news = require('./routes/news')(app);

app.use('/', index);
app.use('/users', users);
app.use('/secret', secret);
app.use('/public', public);
app.post('/oauth/token', oauth2.token);
app.use('/logout', logout);
app.use('/checkSession', checkSession);
app.use('/dbSeed', dbSeed);
app.use('/news', news);

/**
 * Catch and Handle route errors below
 */

// catch 404 and forward to error handler
//app.use(function(req, res, next) {
//    var err = new Error('Not Found');
//    err.status = 404;
//    next(err);
//});

// development error handler
// will print stacktrace
//if (app.get('env') === 'development') {
//    app.use(function(err, req, res, next) {
//        res.status(err.status || 500).send('error', {
//            message: err.message,
//            error: err
//        })
//    });
//}

// production error handler
// no stacktraces leaked to user
//app.use(function(err, req, res, next) {
//    res.status(err.status || 500);
//    res.render('error', {
//        message: err.message,
//        error: {}
//    });
//});

module.exports = app;