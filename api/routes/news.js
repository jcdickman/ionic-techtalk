module.exports = function (app) {
    var express = require('express');
    var router = express.Router();
    var $q = require('q');

    /**
     * @api {get} /news
     * @apiName GetNews
     * @apiGroup News
     *
     * @apiHeader (HeaderGroup) {Object} authorization Authorization value.
     * @apiHeaderExample {json} Header-Example:
     *     {
     *       "Authorization": "Bearer TxOqmA4pPcCrTLM3rizY4JpvOkm4kgm3mSSgqKmNkWiEVIjHrgw5ZNkKeIOTgScEUBGiWnyqLBDPJDGJWasJ37srlht4f6Ny9iexAt"
     *     }
     *
     * @apiSuccess {Object[]} data An array of news items
     *
     */

    router.get('/', app.passport.authenticate('bearer', { session: false }), [readNewsCheck, getNews]);

    return router;

    /**
     * Helper Functions
     */

    function readNewsCheck(req,res,next) {
        if(req.authInfo.scope.indexOf('news:read') == -1) {
            res.statusCode = 403;
            return res.end('Forbidden');
        }
        next();
    }

    function getNews(req,res) {

        var authHeader = req.headers.authorization.split(' ');
        var token = authHeader[1];
        var models = require('../models');

        models.NewsItem.findAll().then(function(news) {
            console.log(news);
            return res.send(JSON.stringify(news));
        });

    }

};