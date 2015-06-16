module.exports = function (app) {
    var express = require('express');
    var router = express.Router();

    /**
     * @api {post} /logout Logout the active user
     * @apiVersion 0.0.1
     * @apiName Logout
     * @apiGroup User
     *
     * @apiSuccessExample Success-Response:
     *     HTTP/1.1 200 OK
     *     {
     *       "success": "true"
     *     }
     */

    router.post('/', app.passport.authenticate('bearer', { session: false }), [logout]);

    return router;

    /**
     * Helper Functions
     */

    function logout(req, res) {
        var models = require('../models');
        var authHeader = req.headers.authorization.split(' ');
        var token = authHeader[1];

        models.AccessToken.deleteAccessToken(token,function(err,tokenObj) {
            if (err) {
                res.statusCode = 500;
                return res.end(err.message);
            } else if (!token) {
                res.statusCode = 403;
                return res.end('Forbidden');
            } else {
                return res.end('success');
            }
        });
    }
};