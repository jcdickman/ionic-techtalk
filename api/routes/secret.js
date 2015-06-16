/**
 * User: mikeroth
 * Date: 4/13/15
 * Time: 2:53 PM
 */


module.exports = function (app) {
    var express = require('express');
    var router = express.Router();

    /**
     * @api {get} /secret
     * @apiName GetUser
     * @apiGroup Secret
     *
     * @apiSuccess {String} firstname Firstname of the User.
     * @apiSuccess {String} lastname  Lastname of the User.
     */
    return router.get('/', app.passport.authenticate('bearer', { session: false }), [secretCheck, secretArea]);

    function secretCheck(req,res,next) {
        if(req.authInfo.scope.indexOf('editContent') == -1) {
            res.statusCode = 403;
            return res.end('Forbidden');
        }
        return next();
    }

    function secretArea(req,res) {
        res.send('Secret Area');
    }

};