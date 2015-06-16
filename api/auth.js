/**
 * Module dependencies.
 */
var passport = require('passport')
    , BearerStrategy = require('passport-http-bearer').Strategy
    , BasicStrategy = require('passport-http').BasicStrategy
    , models = require('./models/index.js');

/**
 * BearerStrategy
 *
 * This strategy is used to authenticate either users or clients based on an access token
 * (aka a bearer token).  If a user, they must have previously authorized a client
 * application, which is issued an access token to make requests on behalf of
 * the authorizing user.
 */
passport.use(new BearerStrategy(
    function(accessToken, done) {
        models.AccessToken.getAccessToken(accessToken, function(err, token) {
            if (err) { return done(null, false, {message: err}); }
            if (!token) { return done(null, false); }
            if(token.userId != null) {
                models.User.getUser(token.userId, function(err, user) {
                    if (err) { return done(err); }
                    if (!user) { return done(null, false); }
                    user.getPermissionNames(function(err, permissions) {
                        var info = { scope: JSON.parse(permissions) };
                        done(null, user, info);
                    });
                });
            }
        });
    }
));

passport.use(new BasicStrategy(
    function(username, password, done) {
        models.User.authenticate(username,password,function(err, user) {
            if (err) { return done(err); }
            if (!user) { return done(null, false); }
            return done(null, user);
        });
    }
));
