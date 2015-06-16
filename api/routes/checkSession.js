module.exports = function (app) {
    var express = require('express');
    var router = express.Router();

    /**
     * @api {get} /checkSession
     * @apiName GetCheckSession
     * @apiGroup checkSession
     *
     * @apiHeader (HeaderGroup) {Object} authorization Authorization value.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "Authorization": "Bearer TxOqmA4pPcCrTLM3rizY4JpvOkm4kgm3mSSgqKmNkWiEVIjHrgw5ZNkKeIOTgScEUBGiWnyqLBDPJDGJWasJ37srlht4f6Ny9iexAt"
     *     }
     *
     * @apiSuccess {Object[]} data The logged in user
     *
     */
    return router.get('/', app.passport.authenticate('bearer', { session: false }), [editContentCheck, getUser]);

    /**
     * Helper functions
     */

    function editContentCheck(req,res,next) {
        if(req.authInfo.scope.indexOf('readOwnUser') == -1) {
            res.statusCode = 403;
            return res.end('Forbidden');
        }
        return next();
    }

    function getUser(req, res) {

        var authHeader = req.headers.authorization.split(' ');
        var token = authHeader[1];
        var models = require('../models');

        models.AccessToken.getAccessToken(token,function(err,tokenObj) {
            models.User.getUser(tokenObj.userId, function(err, user) {
                if (err) { return done(err); }
                if (!user) { return done(null, false); }
                res.send(JSON.stringify(user));
            });
        });

    }

};