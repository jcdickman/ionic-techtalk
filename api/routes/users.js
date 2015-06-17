module.exports = function (app) {
    var express = require('express');
    var router = express.Router();

    /**
     * @api {post} /users Create a new user
     * @apiVersion 0.0.1
     * @apiName CreateUser
     * @apiGroup User
     *
     * @apiParam {String} username  Username of new user.
     * @apiParam {String} password   Password of new user.
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "user": {
     *          "id": "1",
     *          "username": "jsmith",
     *          "password": "testPass"
     *       }
     *     }
     */

    router.post('/', app.passport.authenticate('bearer', { session: false }), [createUserCheck,createUser]);

    /**
     * @api {get} /portalHome
     * @apiName GetPortalHome
     * @apiGroup PortalHome
     *
     * @apiHeader (HeaderGroup) {Object} authorization Authorization value.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "Authorization": "Bearer TxOqmA4pPcCrTLM3rizY4JpvOkm4kgm3mSSgqKmNkWiEVIjHrgw5ZNkKeIOTgScEUBGiWnyqLBDPJDGJWasJ37srlht4f6Ny9iexAt"
     *     }
     *
     * @apiSuccess {Object[]} data An array of entities to be stored in the breeze cache.
     *
     */

    router.get('/:id', app.passport.authenticate('bearer', { session: false }), [readOwnUserCheck,getUser]);

    return router;

    /**
     * Helper Functions
     */

    function createUserCheck(req, res, next) {
        if(req.authInfo.scope.indexOf('user:create') == -1) {
            res.statusCode = 403;
            return res.end('Forbidden');
        }
        next();
    }

    function readOwnUserCheck(req, res, next) {
        if(req.authInfo.scope.indexOf('user:read') == -1) {
            res.statusCode = 403;
            return res.end('Forbidden');
        }
        next();
    }

    function createUser(req, res) {
        var models = require('../models');
        //Bug fix for when POST data is empty so that it doesn't persist in the DB
        if ((typeof req.param('username') != 'undefined') && (typeof req.param('password') != 'undefined')) {
            console.log(req.param('username'));
            models.User.findOrCreate({
                where : {
                    username: req.param('username'),
                    password: req.param('password')
                }
            }).spread(function (user, created) {
                if (created) {
                    console.log('created new user');
                    res.send(user);
                } else {
                    res.send('user already exists');
                }
            })
        } else {
            res.send('Username or password cannot be NULL');
        }
    }

    function getUser(req, res) {
        var authHeader = req.headers.authorization.split(' ');
        var token = authHeader[1];
        var models = require('../models');
        models.AccessToken.getAccessToken(token,function(err,tokenObj) {
            models.User.getUser(req.params.id, function(err, user) {
                //for non-admins, only view their own user info
                if ((req.authInfo.scope.indexOf('readUsers') == -1) && (tokenObj.userId !== parseInt(user.id))) {
                    res.statusCode = 403;
                    return res.end('Forbidden');
                } else {
                    var responseObj = {
                        user: user,
                        permissions: []
                    };
                    user.getPermissions(function(err, permissions) {
                        //if (err) { return done(err); }
                        //if (!permissions) { return done(null, false); }
                        permissions.forEach(function(permission) {
                            responseObj.permissions.push(permission);
                        });
                        return res.send(JSON.stringify(responseObj));
                    });
                }
            });
        });
    }

};