var express = require('express');
var router = express.Router();
var $q = require('q');
/* GET users listing. */
router.get('/', function(req, res) {
    return res.end('Public Area');
});

module.exports = router;