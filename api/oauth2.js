/**
 * Module dependencies.
 */
var oauth2orize = require('oauth2orize')
    , passport = require('passport')
    , models = require('./models/index.js')
    , utils = require('./utils');

// create OAuth 2.0 server
var server = oauth2orize.createServer();

// Register serialialization and deserialization functions.
//
// When a client redirects a user to user authorization endpoint, an
// authorization transaction is initiated.  To complete the transaction, the
// user must authenticate and approve the authorization request.  Because this
// may involve multiple HTTP request/response exchanges, the transaction is
// stored in the session.
//
// An application must supply serialization functions, which determine how the
// client object is serialized into the session.  Typically this will be a
// simple matter of serializing the client's ID, and deserializing by finding
// the client by ID from the database.

server.serializeClient(function(client, done) {
    return done(null, client.id);
});

server.deserializeClient(function(id, done) {
    models.Client.getClientById(id, function(err, client) {
        if (err) { return done(err); }
        return done(null, client);
    });
});


// Exchange user id and password for access tokens.  The callback accepts the
// `client`, which is exchanging the user's name and password from the
// authorization request for verification. If these values are validated, the
// application issues an access token on behalf of the user who authorized the code.

//in the documentation for oauth2orize you will see the callback as function(client,username,password,scope,done)
//however in this application we dont have a use for the client so the user is passed in instead from
//auth.js in the BasicStrategy
server.exchange(oauth2orize.exchange.password(function(user, username, password, scope, done) {
    //console.log(user);
    //console.log(username);
    //console.log(password);
    //console.log(scope);

    if(user === null) {
        return done(null, false);
    }else{
        var token = utils.uid(256);
        models.AccessToken.saveAccessToken(token, user.id, function(err, token) {
            if (err) { return done(err); }
            done(null, token);
        });
    }
}));

exports.token = [
    passport.authenticate(['basic'], { session: false }),
    server.token(),
    server.errorHandler()
];